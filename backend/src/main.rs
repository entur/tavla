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

use tokio::{net::TcpListener, signal, time};

use redis::{
    aio::MultiplexedConnection, AsyncCommands, Client, ConnectionAddr, ConnectionInfo,
    RedisConnectionInfo, RedisError,
};

use futures_util::StreamExt as _;

#[derive(Clone)]
struct AppState {
    master: MultiplexedConnection,
    replicas: Client,
    runtime_status: CancellationToken,
    task_tracker: TaskTracker,
}

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
        .with_state(redis_clients);

    axum::serve(listener, app)
        .with_graceful_shutdown(graceful_shutdown(runtime_status, task_tracker))
        .await
        .unwrap();
}

async fn graceful_shutdown(cancellation_token: CancellationToken, tracker: TaskTracker) {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install ctrl+c handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install unix signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => { cancellation_token.cancel(); tracker.close(); tracker.wait().await;}
        _ = terminate => { cancellation_token.cancel(); tracker.close(); tracker.wait().await;}
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
            return;
        }
    };
    match pubsub.subscribe(bid.clone()).await {
        Ok(_) => (),
        Err(_) => {
            return;
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
                if let Ok(payload) = msg.get_payload() {
                    match ws.send(ws::Message::Text(payload)).await {
                        Ok(_) => (),
                        Err(_) => {break;}
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

use serde_json::Value;
use tokio_stream::wrappers::IntervalStream;
use tokio_util::{sync::CancellationToken, task::TaskTracker};

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

async fn setup_redis() -> (MultiplexedConnection, Client) {
    let redis_pw = std::env::var("REDIS_PASSWORD").expect("Expected to find redis pw");
    let conn_info = RedisConnectionInfo {
        db: 0,
        username: None,
        password: Some(redis_pw),
    };
    // TODO: replace host with redis master dns
    let master = redis::Client::open(ConnectionInfo {
        addr: ConnectionAddr::Tcp("127.0.0.1".into(), 6379),
        redis: conn_info.clone(),
    })
    .expect("Expected valid master connection");

    let master_multiplexer = master
        .get_multiplexed_tokio_connection()
        .await
        .expect("Expected multiplexed master connection");

    let replica = redis::Client::open(ConnectionInfo {
        addr: ConnectionAddr::Tcp("127.0.0.1".into(), 6380),
        redis: conn_info,
    })
    .expect("Expected valid replica connection");

    (master_multiplexer, replica)
}
