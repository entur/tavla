use std::time::Duration;

use axum::{
    body::Body,
    extract::{Path, State},
    http::{HeaderValue, Method, Response, StatusCode},
    routing::{get, post},
    Json, Router,
};

// Timing constants
const METRICS_UPDATE_INTERVAL_SECS: u64 = 600; // 10 minutes - how often to update Prometheus metrics
const SUBSCRIBE_TIMEOUT_SECS: u64 = 90; // 1.5 minutes - max wait time for subscribe connections
const HEARTBEAT_TTL_SECS: u64 = 600; // 10 minutes - how long heartbeats are stored in Redis

use axum_auth::AuthBearer;
use prometheus::{Encoder, Gauge, Registry, TextEncoder};
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
use std::sync::Arc;

#[derive(Clone)]
pub struct Metrics {
    pub registry: Registry,
    pub active_boards: Gauge,
}

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
    pub tid: Uuid,
    pub browser: String,
    pub screen_width: u32,
    pub screen_height: u32,
}

#[tokio::main]
async fn main() {
    let host = std::env::var("HOST").unwrap_or("0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or("3000".to_string());
    let key = std::env::var("BACKEND_API_KEY").expect("Expected to find api key");

    // Setup Prometheus metrics
    let registry = Registry::new();
    let active_boards_gauge = Gauge::new(
        "tavla_active_sessions_current",
        "Number of currently active tavla sessions/tabs with heartbeats",
    )
    .expect("Failed to create active_sessions metric");

    registry
        .register(Box::new(active_boards_gauge.clone()))
        .expect("Failed to register metrics");

    let metrics = Arc::new(Metrics {
        registry,
        active_boards: active_boards_gauge,
    });

    let listener = TcpListener::bind(format!("{}:{}", host, port))
        .await
        .expect("Failed to bind to address");

    let (master, replicas) = setup_redis().await;

    let runtime_status = CancellationToken::new();
    let task_tracker = TaskTracker::new();

    // Start background task to update metrics regularly
    let metrics_updater = metrics.clone();
    let redis_for_metrics = replicas.clone();
    task_tracker.spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(METRICS_UPDATE_INTERVAL_SECS));
        loop {
            interval.tick().await;

            // Update active boards count
            if let Ok(mut connection) = redis_for_metrics.get_multiplexed_async_connection().await {
                match redis::cmd("KEYS")
                    .arg("heartbeat:*")
                    .query_async(&mut connection)
                    .await
                {
                    Ok(keys) => {
                        let keys: Vec<String> = keys;
                        metrics_updater.active_boards.set(keys.len() as f64);
                    }
                    Err(_) => {
                        eprintln!("Warning: Failed to update metrics from Redis");
                    }
                }
            } else {
                eprintln!("Warning: Failed to connect to Redis for metrics update");
            }
        }
    });

    let redis_clients = AppState {
        master,
        replicas,
        key,
        metrics: metrics.clone(),
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
        .route("/active/bids", get(active_board_ids))
        .route("/heartbeat", post(heartbeat))
        .route("/metrics", get(metrics_handler))
        .route("/heartbeat/active", get(active_boards_heartbeat))
        .with_state(redis_clients)
        .layer(cors);

    axum::serve(listener, app)
        .with_graceful_shutdown(graceful_shutdown(runtime_status, task_tracker))
        .await
        .expect("Failed to start server")
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

async fn metrics_handler(State(state): State<AppState>) -> Result<Response<Body>, StatusCode> {
    let encoder = TextEncoder::new();
    let metric_families = state.metrics.registry.gather();
    let mut buffer = Vec::new();

    if encoder.encode(&metric_families, &mut buffer).is_err() {
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    Response::builder()
        .header("Content-Type", encoder.format_type())
        .body(Body::from(buffer))
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

#[derive(Serialize, Deserialize)]
pub struct HeartbeatResponse {
    pub count: usize,
    pub clients: Vec<ActiveInfo>,
}

async fn active_boards_heartbeat(
    AuthBearer(token): AuthBearer,
    State(state): State<AppState>,
) -> Result<Json<HeartbeatResponse>, StatusCode> {
    if token != state.key {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let mut connection = state
        .replicas
        .get_multiplexed_async_connection()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let keys: Vec<String> = redis::cmd("KEYS")
        .arg("heartbeat:*")
        .query_async(&mut connection)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut clients = Vec::new();

    for key in keys {
        if let Ok(val) = connection.clone().get::<_, String>(&key).await {
            if let Ok(client_info) = serde_json::from_str::<ActiveInfo>(&val) {
                clients.push(client_info);
            }
        }
    }

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
        return Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .body(Body::from(vec![]))
            .map_err(|_| AppError::from(anyhow::anyhow!("Failed to build response")));
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
        return Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .body(Body::from(0.to_string()))
            .map_err(|_| AppError::from(anyhow::anyhow!("Failed to build response")));
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
        () = time::sleep(Duration::from_secs(SUBSCRIBE_TIMEOUT_SECS)) => {
            Message::Timeout
        }
    };

    Ok(res)
}

async fn heartbeat(State(state): State<AppState>, body: String) -> Result<StatusCode, AppError> {
    let payload: HeartbeatPayload = serde_json::from_str(&body)?;

    let key = format!("heartbeat:{}:{}", payload.bid, payload.tid);
    let value = serde_json::to_string(&ActiveInfo {
        bid: payload.bid,
        tid: payload.tid,
        browser: payload.browser,
        screen_width: payload.screen_width,
        screen_height: payload.screen_height,
    })?;

    let mut connection = state.master.clone();
    let _: () = connection.set_ex(key, value, HEARTBEAT_TTL_SECS).await?;
    Ok(StatusCode::OK)
}
