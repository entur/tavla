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

use tokio::net::TcpListener;

use redis::{
    aio::MultiplexedConnection, AsyncCommands, Client, ConnectionAddr, ConnectionInfo,
    RedisConnectionInfo, RedisError,
};

use futures_util::StreamExt as _;

#[derive(Clone)]
struct RedisClients {
    master: MultiplexedConnection,
    replicas: Client,
}

#[tokio::main]
async fn main() {
    let host = std::env::var("HOST").unwrap_or("0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or("3001".to_string());

    let listener = TcpListener::bind(format!("{}:{}", host, port))
        .await
        .unwrap();

    let (master, replicas) = setup_redis().await;

    let redis_clients = RedisClients { master, replicas };

    let app = Router::new()
        .route("/subscribe/:bid", get(subscribe))
        .route("/refresh/:bid", post(trigger))
        .with_state(redis_clients);

    axum::serve(listener, app).await.unwrap();
}

async fn subscribe(
    Path(bid): Path<String>,
    State(state): State<RedisClients>,
    ws: WebSocketUpgrade,
) -> Response<Body> {
    ws.on_upgrade(|socket| active_subscription(socket, bid, state))
}

async fn active_subscription(mut ws: WebSocket, bid: String, mut state: RedisClients) {
    let _: Result<String, RedisError> = state.master.incr("active_boards", 1).await;
    let handle = tokio::spawn(async move {
        let mut pubsub = match state.replicas.get_async_pubsub().await {
            Ok(ps) => ps,
            Err(e) => {
                println!("{:?}", e);
                return StatusCode::INTERNAL_SERVER_ERROR;
            }
        };
        let res = pubsub.subscribe(bid).await;

        let _ = ws.send(ws::Message::Ping(vec![0])).await;

        let mut msg_stream = pubsub.on_message();
        loop {
            let msg = msg_stream.next().await;
            println!("{:?}", msg);
            let _ = match msg {
                Some(m) => {
                    ws.send(ws::Message::Text(m.get_payload().unwrap_or("".into())))
                        .await
                }
                None => ws.send(ws::Message::Ping(vec![0])).await,
            };
        }
    });
    let _ = handle.await;

    let _: Result<String, RedisError> = state.master.decr("active_boards", 1).await;
}

use serde_json::Value;

async fn trigger(
    Path(bid): Path<String>,
    State(mut state): State<RedisClients>,
    Json(payload): Json<Value>,
) -> StatusCode {
    // take new board as input
    println!("{:?}, {}", bid, payload.clone().to_string());
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
