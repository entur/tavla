use std::{collections::HashMap, time::Duration};

use axum::{
    body::Body,
    extract::{
        ws::{self, WebSocket},
        Path, State, WebSocketUpgrade,
    },
    http::{Response, StatusCode},
    routing::{get, post},
    Router,
};

use tokio::{
    net::TcpListener,
    sync::{
        mpsc::{Receiver, Sender},
        oneshot,
    },
};

use redis::{
    aio::MultiplexedConnection, AsyncCommands, Client, ConnectionAddr, ConnectionInfo,
    RedisConnectionInfo, RedisError,
};

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
        let mut con = match state.replicas.get_connection() {
            Ok(c) => c,
            Err(e) => {
                println!("{:?}", e);
                return StatusCode::INTERNAL_SERVER_ERROR;
            }
        };
        let _ = con.set_read_timeout(Some(Duration::from_secs(120)));
        let mut pubsub = con.as_pubsub();
        let res = pubsub.subscribe(bid);

        let _ = ws.send(ws::Message::Ping(vec![0])).await;

        println!("{:?}", res);

        loop {
            let msg = pubsub.get_message();

            println!("{:?}", msg);
            let _ = match msg {
                Ok(_) => ws.send(ws::Message::Ping(vec![1])).await,
                Err(_) => ws.send(ws::Message::Ping(vec![0])).await,
            };
        }
    });
    let _ = handle.await;

    let _: Result<String, RedisError> = state.master.decr("active_boards", 1).await;
}

async fn trigger(Path(bid): Path<String>, State(mut state): State<RedisClients>) -> StatusCode {
    // take new board as input
    println!("{:?}", bid);
    let cmd: Result<i8, RedisError> = state.master.publish(bid, "").await;
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
