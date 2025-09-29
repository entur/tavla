use std::time::Duration;

use axum::{
    body::Body,
    extract::{Path, State},
    http::{HeaderName, HeaderValue, Method, Response, StatusCode},
    routing::{get, post},
    Json, Router,
};

use ::futures::future;
use axum_auth::AuthBearer;
use serde_json::{json, to_string, Value};
use tokio::{net::TcpListener, time};

use redis::{AsyncCommands, ConnectionLike};

use tokio_stream::StreamExt;
use tokio_util::{sync::CancellationToken, task::TaskTracker};

mod types;

mod utils;
use tower_http::cors::CorsLayer;
use types::{AppError, AppState, BoardAction, Message};
use utils::{graceful_shutdown, setup_redis};
use uuid::Uuid;

use crate::types::Guard;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct HeartbeatPayload {
    bid: String,
    tid: Uuid,
    browser: String,
    screen_width: u32,
    screen_height: u32,
}

#[derive(Serialize, Deserialize)]
pub struct ActiveInfo {
    pub bid: String,
    pub browser: String,
    pub screen_width: u32,
    pub screen_height: u32,
}

#[derive(Serialize, Deserialize)]
pub struct ActiveInfoCount {
    pub count: usize,
    pub client: ActiveInfo,
}

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
        .allow_headers([
            HeaderName::from_static("content-type"),
            HeaderName::from_static("authorization"),
        ])
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
        .route("/active/bids", get(active_board_ids))
        .route("/heartbeat", post(heartbeat))
        .route("/heartbeat/active", get(active_boards_heartbeat))
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
    let _: () = state.master.publish("update", vec![0]).await?;
    time::sleep(Duration::from_secs(5)).await;
    let _: () = state.master.set("active_boards", 0).await?;
    Ok(StatusCode::OK)
}

async fn heartbeat(
    AuthBearer(token): AuthBearer,
    State(state): State<AppState>,
    Json(payload): Json<HeartbeatPayload>,
) -> Result<StatusCode, AppError> {
    if token != state.key {
        return Ok(StatusCode::UNAUTHORIZED);
    }

    let mut connection = state.master.clone();

    let key = format!("heartbeat:{}:{}", payload.bid, payload.tid);

    let value = serde_json::to_string(&ActiveInfo {
        bid: payload.bid,
        browser: payload.browser,
        screen_width: payload.screen_width,
        screen_height: payload.screen_height,
    })?;

    let _: () = connection.set_ex(key, value.to_string(), 60).await?;

    Ok(StatusCode::OK)
}
#[derive(Serialize, Deserialize)]
pub struct HeartbeatResponse {
    pub count: usize,
    pub clients: Vec<ActiveInfo>,
}

async fn active_boards_heartbeat(
    AuthBearer(token): AuthBearer,
    State(state): State<AppState>,
) -> Result<Json<HeartbeatResponse>, AppError> {
    if token != state.key {
        // TODO: This should be handled better
        todo!()
    }

    let mut connection = state.replicas.get_multiplexed_async_connection().await?;

    let keys: Vec<String> = redis::cmd("KEYS")
        .arg("heartbeat:*")
        .query_async(&mut connection)
        .await?;

    let res = keys
        .clone()
        .into_iter()
        .map(|key| async {
            let val = connection.clone().get::<_, String>(key).await.unwrap();
            return serde_json::from_str::<ActiveInfo>(&val).unwrap();
        })
        .collect::<Vec<_>>();

    let clients = future::join_all(res).await;

    Ok(Json(HeartbeatResponse {
        count: clients.len(),
        clients,
    }))
}

async fn check_health(State(mut state): State<AppState>) -> Result<StatusCode, AppError> {
    if !state.replicas.check_connection() {
        return Ok(StatusCode::INTERNAL_SERVER_ERROR);
    }
    state.master.get::<&str, i32>("active_boards").await?;
    Ok(StatusCode::OK)
}

async fn active_board_ids(
    AuthBearer(token): AuthBearer,
    State(state): State<AppState>,
) -> Result<Response<Body>, AppError> {
    if token != state.key {
        return Ok(Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .body(Body::from(vec![]))
            .unwrap());
    }

    let mut connection = state.replicas.get_multiplexed_async_connection().await?;

    let channels: Vec<String> = redis::cmd("PUBSUB")
        .arg("CHANNELS")
        .query_async(&mut connection)
        .await?;

    let filtered_channels: Vec<String> = channels
        .into_iter()
        .filter(|channel| channel != "update")
        .collect();

    let count = filtered_channels.len();

    let response = json!(
        {
            "channels": filtered_channels,
            "count": count
        }
    );
    let json_body = serde_json::to_string(&response)?;

    Ok(Response::new(Body::from(json_body)))
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
    let _: () = state
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
    let _: () = state.master.publish("update", vec![0]).await?;
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
    let _: () = state
        .master
        .publish(bid, to_string(&BoardAction::Update)?)
        .await?;
    Ok(StatusCode::OK)
}

// Brukes i useRefresh,
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
