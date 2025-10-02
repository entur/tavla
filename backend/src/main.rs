use std::time::Duration;

use axum::{
    body::{Body, Bytes},
    extract::{Path, Query, State},
    http::{HeaderName, HeaderValue, Method, Response, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};

use ::futures::future;
use axum_auth::AuthBearer;
use prometheus::{Encoder, Gauge, Registry, TextEncoder};
use serde_json::{json, to_string, Value};
use tokio::{net::TcpListener, time};

use redis::{AsyncCommands, ConnectionLike};

use tokio_stream::StreamExt;
use tokio_util::{sync::CancellationToken, task::TaskTracker};

mod types;

mod utils;
use tower_http::cors::{Any, CorsLayer};
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

    // Setup Prometheus metrics
    let registry = Registry::new();
    let active_boards_gauge = Gauge::new("tavla_active_sessions_current", "Number of currently active tavla sessions/tabs with heartbeats")
        .expect("Failed to create active_sessions metric");
    
    registry.register(Box::new(active_boards_gauge.clone())).unwrap();
    
    let metrics = Arc::new(Metrics {
        registry,
        active_boards: active_boards_gauge,
    });

    let listener = TcpListener::bind(format!("{}:{}", host, port))
        .await
        .unwrap();

    let (master, replicas) = setup_redis().await;

    let runtime_status = CancellationToken::new();
    let task_tracker = TaskTracker::new();

    // Start background task to update metrics regularly
    let metrics_updater = metrics.clone();
    let redis_for_metrics = replicas.clone();
    task_tracker.spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(30));
        loop {
            interval.tick().await;
            
            // Update active boards count
            if let Ok(mut connection) = redis_for_metrics.get_multiplexed_async_connection().await {
                let keys: Vec<String> = redis::cmd("KEYS")
                    .arg("heartbeat:*")
                    .query_async(&mut connection)
                    .await
                    .unwrap_or_default();
                
                // Count total active tabs/sessions (not unique board IDs)
                metrics_updater.active_boards.set(keys.len() as f64);
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
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

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
        .route("/tvtest", get(tvtest_get))
        .route("/tvtest-simple", post(tvtest_post_simple))
        .route("/heartbeat-simple", post(heartbeat_simple))
        .route("/pixel.gif", get(pixel_gif))


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

async fn metrics_handler(
    AuthBearer(token): AuthBearer,
    State(state): State<AppState>
) -> Result<Response<Body>, StatusCode> {
    // Beskytt metrics med samme API-nøkkel
    if token != state.key {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let encoder = TextEncoder::new();
    let metric_families = state.metrics.registry.gather();
    let mut buffer = Vec::new();
    encoder.encode(&metric_families, &mut buffer).unwrap();
    
    Ok(Response::builder()
        .header("Content-Type", encoder.format_type())
        .body(Body::from(buffer))
        .unwrap())
}

async fn heartbeat(
    State(state): State<AppState>,
    Json(payload): Json<HeartbeatPayload>,
) -> Result<StatusCode, AppError> {

    let mut connection = state.master.clone();

    let key = format!("heartbeat:{}:{}", payload.bid, payload.tid);

    let value = serde_json::to_string(&ActiveInfo {
        bid: payload.bid,
        browser: payload.browser,
        screen_width: payload.screen_width,
        screen_height: payload.screen_height,
    })?;

    let _: () = connection.set_ex(key, value.to_string(), 60).await?;

    // Metrics will be updated by background task every 30 seconds
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

async fn tvtest_get() -> Result<StatusCode, AppError> {
    println!("SUCCESS: GET /tvtest received");
    Ok(StatusCode::OK)
}

async fn tvtest_post_simple() -> Result<StatusCode, AppError> {
    println!("SUCCESS: POST /tvtest-simple received");
    Ok(StatusCode::OK)
}

async fn heartbeat_simple(
    State(state): State<AppState>,
    bytes: Bytes, // rå body (Content-Type: text/plain)
) -> Result<StatusCode, AppError> {
    // body er JSON-serialisert i frontenden, men sendt som text/plain (simple request)
    let payload: HeartbeatPayload = serde_json::from_slice(&bytes)?;

    let key = format!("heartbeat:{}:{}", payload.bid, payload.tid);
    let value = serde_json::to_string(&ActiveInfo {
        bid: payload.bid,
        browser: payload.browser,
        screen_width: payload.screen_width,
        screen_height: payload.screen_height,
    })?;

    let mut connection = state.master.clone();
    let _: () = connection.set_ex(key, value, 60).await?;
    Ok(StatusCode::OK)
}


#[derive(Deserialize)]
struct PixelQ {
    bid: String,
    tid: String,
    #[serde(default)]
    w: Option<u32>,
    #[serde(default)]
    h: Option<u32>,
    #[serde(default)]
    ua: Option<String>,
    #[serde(default)]
    #[allow(dead_code)]
    ts: Option<u64>,
}

async fn pixel_gif(
    State(state): State<AppState>,
    Query(q): Query<PixelQ>,
) -> impl IntoResponse {

    let value = serde_json::to_string(&ActiveInfo {
        bid: q.bid.clone(),
        browser: q.ua.unwrap_or_else(|| "unknown".to_string()),
        screen_width: q.w.unwrap_or(0),
        screen_height: q.h.unwrap_or(0),
    }).unwrap_or_else(|_| "{\"bid\":\"err\",\"browser\":\"err\",\"screen_width\":0,\"screen_height\":0}".to_string());

    let key = format!("heartbeat:{}:{}", q.bid, q.tid);
    let mut connection = state.master.clone();
    let _: () = connection.set_ex(key, value, 60).await.unwrap_or(());

    const PIXEL: &[u8] = b"GIF89a\
\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff!\
\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\
\x01\x00\x00\x02\x02D\x01\x00;";

    let resp = Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "image/gif")
        .header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        .body(Body::from(PIXEL))
        .unwrap();

    resp
}

