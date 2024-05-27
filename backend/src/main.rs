use std::time::Duration;

use axum::{
    extract::{Path, State},
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};

use axum_auth::AuthBearer;
use serde_json::{from_str, Value};
use tokio::{net::TcpListener, time};

use redis::AsyncCommands;

use tokio_stream::StreamExt;
use tokio_util::{sync::CancellationToken, task::TaskTracker};

mod types;

mod utils;
use tower_http::cors::CorsLayer;
use types::{AppError, AppState, Message};
use utils::{graceful_shutdown, setup_redis};

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
        runtime_status: runtime_status.clone(),
        task_tracker: task_tracker.clone(),
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
        .route("/subscribe/:bid", get(subscribe))
        .route("/refresh/:bid", post(trigger))
        .route("/update", post(update))
        .with_state(redis_clients)
        .layer(cors);

    axum::serve(listener, app)
        .with_graceful_shutdown(graceful_shutdown(runtime_status, task_tracker))
        .await
        .unwrap()
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
    state.master.publish(bid, payload.to_string()).await?;
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

async fn subscribe(
    Path(bid): Path<String>,
    State(mut state): State<AppState>,
) -> Result<Message, AppError> {
    let mut pubsub = state.replicas.get_async_pubsub().await?;
    pubsub.subscribe(bid).await?;
    pubsub.subscribe("update").await?;

    state
        .master
        .incr::<&str, i32, i32>("active_boards", 1)
        .await?;

    let mut msg_stream = pubsub.on_message();
    let res = tokio::select! {
            Some(msg) = msg_stream.next() => {
    let channel = msg.get_channel_name();
                if channel == "update" {
                    Message::Update
                } else {
                let payload = msg.get_payload::<String>()?;
                Message::Refresh {
                    payload: from_str::<Value>(payload.as_str())?,
                }}
            }
        () = time::sleep(Duration::from_secs(55)) => {
            Message::Timeout
        }
    };

    state
        .master
        .decr::<&str, i32, i32>("active_boards", 1)
        .await?;

    Ok(res)
}
