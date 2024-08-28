use std::time::Duration;

use axum::{
    body::Body,
    extract::{Path, State},
    http::{HeaderValue, Method, Response, StatusCode},
    routing::{get, post},
    Json, Router,
};

use axum_auth::AuthBearer;
use serde_json::{to_string, Value};
use tokio::{net::TcpListener, time};

use redis::{AsyncCommands, ConnectionLike};

use tokio_stream::StreamExt;
use tokio_util::{sync::CancellationToken, task::TaskTracker};

mod types;

mod utils;
use tower_http::cors::CorsLayer;
use types::{AppError, AppState, BoardAction, Message};
use utils::{graceful_shutdown, setup_redis};

use crate::types::Guard;

#[tokio::main]
async fn main() {
    let host = std::env::var("HOST").unwrap_or("0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or("3000".to_string());
    let key = std::env::var("BACKEND_API_KEY").expect("Expected to find api key");

    let listener = TcpListener::bind(format!("{}:{}", host, port))
        .await
        .unwrap();

    let (master, replicas) = setup_redis().await;

    let runtime_status = CancellationToken::new();
    let task_tracker = TaskTracker::new();

    let redis_clients = AppState {
        master,
        replicas,
        key,
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_credentials(true)
        .allow_origin([
            "http://localhost:3000".parse::<HeaderValue>().unwrap(),
            "https://tavla.dev.entur.no".parse::<HeaderValue>().unwrap(),
            "https://tavla.entur.no".parse::<HeaderValue>().unwrap(),
        ]);

    let app = Router::new()
        .route("/active", get(active_boards))
        .route("/subscribe/:bid", get(subscribe))
        .route("/refresh/:bid", post(trigger))
        .route("/update", post(update))
        .route("/update/:bid", post(update_board))
        .route("/alive", get(check_health))
        .route("/reset", post(reset_active))
        .with_state(redis_clients)
        .layer(cors);

    axum::serve(listener, app)
        .with_graceful_shutdown(graceful_shutdown(runtime_status, task_tracker))
        .await
        .unwrap()
}

async fn reset_active(
    AuthBearer(token): AuthBearer,
    State(mut state): State<AppState>,
) -> Result<StatusCode, AppError> {
    if token != state.key {
        return Ok(StatusCode::UNAUTHORIZED);
    }

    state.master.set("active_boards", 0).await?;
    Ok(StatusCode::OK)
}

async fn check_health(State(mut state): State<AppState>) -> Result<StatusCode, AppError> {
    if !state.replicas.check_connection() {
        return Ok(StatusCode::INTERNAL_SERVER_ERROR);
    }
    state.master.get::<&str, i32>("active_boards").await?;
    Ok(StatusCode::OK)
}

async fn active_boards(
    AuthBearer(token): AuthBearer,
    State(mut state): State<AppState>,
) -> Result<Response<Body>, AppError> {
    if token != state.key {
        return Ok(Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .body(Body::from(0.to_string()))
            .unwrap());
    }
    let active_boards = state.master.get::<&str, i32>("active_boards").await?;
    Ok(Response::new(Body::from(active_boards.to_string())))
}

async fn trigger(
    Path(bid): Path<String>,
    AuthBearer(token): AuthBearer,
    State(mut state): State<AppState>,
    Json(payload): Json<Value>,
) -> Result<StatusCode, AppError> {
    if token != state.key {
        return Ok(StatusCode::UNAUTHORIZED);
    }
    state
        .master
        .publish(bid, BoardAction::Refresh { payload })
        .await?;
    Ok(StatusCode::OK)
}

async fn update(
    AuthBearer(token): AuthBearer,
    State(mut state): State<AppState>,
) -> Result<StatusCode, AppError> {
    if token != state.key {
        return Ok(StatusCode::UNAUTHORIZED);
    }
    state.master.publish("update", vec![0]).await?;
    Ok(StatusCode::OK)
}

async fn update_board(
    AuthBearer(token): AuthBearer,
    State(mut state): State<AppState>,
    Path(bid): Path<String>,
) -> Result<StatusCode, AppError> {
    if token != state.key {
        return Ok(StatusCode::UNAUTHORIZED);
    }
    state
        .master
        .publish(bid, to_string(&BoardAction::Update)?)
        .await?;
    Ok(StatusCode::OK)
}

async fn subscribe(
    Path(bid): Path<String>,
    State(state): State<AppState>,
) -> Result<Message, AppError> {
    let mut pubsub = state.replicas.get_async_pubsub().await?;
    pubsub.subscribe(bid).await?;
    pubsub.subscribe("update").await?;

    let _guard = Guard::new(state.master.clone());

    let mut msg_stream = pubsub.on_message();
    let res = tokio::select! {
            Some(msg) = msg_stream.next() => {
                let channel = msg.get_channel_name();
                if channel == "update" {
                    Message::Update
                } else {
                let payload = msg.get_payload::<BoardAction>()?;

                match payload {
                    BoardAction::Refresh { payload } => Message::Refresh { payload },
                    BoardAction::Update => Message::Update,
                }
            }
        }
        () = time::sleep(Duration::from_secs(55)) => {
            Message::Timeout
        }
    };

    Ok(res)
}
