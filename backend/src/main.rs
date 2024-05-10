use std::time::Duration;

use axum::{
    body::Body,
    extract::{
        ws::{self, WebSocket},
        Path, State, WebSocketUpgrade,
    },
    http::{Response, StatusCode},
    routing::{get, post},
    Json, Router,
};

use serde::de::Error;
use tokio::{net::TcpListener, time};

use redis::{AsyncCommands, RedisError};

use futures_util::StreamExt as _;

use serde_json::{from_str, to_string, Value};
use tokio_stream::wrappers::IntervalStream;
use tokio_util::{sync::CancellationToken, task::TaskTracker};

mod types;
use types::AppState;

mod utils;
use utils::{graceful_shutdown, setup_redis};

use crate::types::Message;

#[tokio::main]
async fn main() {
    let host = std::env::var("HOST").unwrap_or("0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or("3001".to_string());

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
    State(mut state): State<AppState>,
    Json(payload): Json<Value>,
) -> StatusCode {
    let cmd: Result<i8, RedisError> = state.master.publish(bid, payload.to_string()).await;
    match cmd {
        Ok(v) => {
            println!("{:?}", v);
            StatusCode::OK
        }
        Err(e) => {
            println!("{:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        }
    }
}

async fn update(State(mut state): State<AppState>) -> StatusCode {
    let cmd: Result<i8, RedisError> = state.master.publish("update", vec![0]).await;
    match cmd {
        Ok(v) => {
            println!("{:?}", v);
            StatusCode::OK
        }
        Err(e) => {
            println!("{:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        }
    }
}

async fn subscribe(
    Path(bid): Path<String>,
    State(state): State<AppState>,
    ws: WebSocketUpgrade,
) -> Response<Body> {
    ws.on_upgrade(|socket| active_subscription(socket, bid, state))
}

async fn active_subscription(mut ws: WebSocket, bid: String, mut state: AppState) {
    state.task_tracker.spawn(async move {
        let mut pubsub = match state.replicas.get_async_pubsub().await {
            Ok(ps) => ps,
            Err(_) => {
                return
            }
        };
        match pubsub.subscribe(bid.clone()).await {
            Ok(_) => (),
            Err(_) => {
                return
            }
        };

        match pubsub.subscribe("update").await {
            Ok(_) => (),
            Err(_) => {
                return
            }
        };


        let mut msg_stream = pubsub.on_message();

        let mut timeout_stream = IntervalStream::new(time::interval(Duration::from_secs(10)));

        if let Ok(res) = state
            .master
            .incr::<&str, i32, i32>("active_boards", 1)
            .await
    {
        println!(
            "Establishing new connection for board with id {:?}. Total active boards: {:?}",
            bid.clone(),
            res
        );
    }

        loop {
            tokio::select! {
                Some(msg) = msg_stream.next() => {
                    let channel = msg.get_channel_name();
                    if channel == "update" {
                        if let Ok(message) = to_string(&Message::Update) {
                            match ws.send(ws::Message::Text(message)).await {
                                    Ok(_) => (),
                                    Err(_) => {break;}
                            }
                        }
                    }
                    if let Ok(payload) = msg.get_payload::<String>() {
                        if let Ok(payload_json) = from_str::<Value>(payload.as_str()) {
                            if let Ok(message) = to_string(&Message::Refresh { payload: payload_json }) {
                                match ws.send(ws::Message::Text(message)).await {
                                    Ok(_) => (),
                                    Err(_) => {break;}
                                }
                            }
                        }
                    }
                }
                Some(_) = timeout_stream.next() => {
                    match ws.send(ws::Message::Ping(vec![0])).await {
                        Ok(_) => (),
                        Err(_) => {break;},
                    }
                }
                _ = state.runtime_status.cancelled() => {println!("Gracefully shutting down..."); break;}
                else => {break;}
            }
        }

        if let Ok(res) = state
            .master
            .decr::<&str, i32, i32>("active_boards", 1)
            .await
    {
        println!(
            "Cleaning up connection for board with id {:?}. Total active boards: {:?}",
            bid, res
        );
    }

    });
}
