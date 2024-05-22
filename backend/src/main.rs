use std::time::Duration;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};

use axum_auth::AuthBearer;
use serde_json::{from_str, Value};
use tokio::{net::TcpListener, time};

use redis::{AsyncCommands, RedisError};

use tokio_stream::StreamExt;
use tokio_util::{sync::CancellationToken, task::TaskTracker};

mod types;

mod utils;
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

    let app = Router::new()
        .route("/subscribe/:bid", get(subscribe))
        .route("/refresh/:bid", post(trigger))
        .route("/update", post(update))
        .with_state(redis_clients);

    axum::serve(listener, app)
        .with_graceful_shutdown(graceful_shutdown(runtime_status, task_tracker))
        .await
        .unwrap();
}

async fn trigger(
    Path(bid): Path<String>,
    AuthBearer(token): AuthBearer,
    State(mut state): State<AppState>,
    Json(payload): Json<Value>,
) -> StatusCode {
    if token != state.key {
        return StatusCode::UNAUTHORIZED;
    }
    let cmd: Result<i8, RedisError> = state.master.publish(bid, payload.to_string()).await;
    match cmd {
        Ok(_) => StatusCode::OK,
        Err(e) => {
            println!("{:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        }
    }
}

async fn update(AuthBearer(token): AuthBearer, State(mut state): State<AppState>) -> StatusCode {
    if token != state.key {
        return StatusCode::UNAUTHORIZED;
    }
    let cmd: Result<i8, RedisError> = state.master.publish("update", vec![0]).await;
    match cmd {
        Ok(_) => StatusCode::OK,
        Err(e) => {
            println!("{:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        }
    }
}

async fn subscribe(
    Path(bid): Path<String>,
    State(state): State<AppState>,
) -> Result<Message, AppError> {
    let mut pubsub = state.replicas.get_async_pubsub().await?;
    pubsub.subscribe(bid).await?;
    pubsub.subscribe("update").await?;

    let mut msg_stream = pubsub.on_message();

    tokio::select! {
            Some(msg) = msg_stream.next() => {
    let channel = msg.get_channel_name();
                if channel == "update" {
                    return Ok(Message::Update);
                }
                let payload = msg.get_payload::<String>()?;
                Ok(Message::Refresh {
                    payload: from_str::<Value>(payload.as_str())?,
                })

            }
        () = time::sleep(Duration::from_secs(55)) => {
            Ok(Message::Timeout)
        }
        }
}
