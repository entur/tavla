use std::collections::HashMap;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::get,
    Router,
};
use redis::{
    AsyncCommands, Commands, ConnectionAddr, ConnectionInfo, RedisConnectionInfo, RedisError,
};

use tokio::{
    net::TcpListener,
    sync::{
        mpsc::{Receiver, Sender},
        oneshot,
    },
};

#[derive(Debug)]
enum Refresh {
    Subscribe {
        bid: String,
        trigger: oneshot::Sender<()>,
    },
    Trigger {
        bid: String,
    },
}

#[derive(Clone)]
struct AppState {
    sender: Sender<Refresh>,
}

#[tokio::main]
async fn main() {
    let host = std::env::var("HOST").unwrap_or("0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or("3001".to_string());
    let redis_pw = std::env::var("REDIS_PASSWORD").expect("Expected to find redis pw");

    let listener = TcpListener::bind(format!("{}:{}", host, port))
        .await
        .unwrap();

    let (sender, receiver) = tokio::sync::mpsc::channel::<Refresh>(32);

    setup_redis(redis_pw).await;

    tokio::spawn(async move {
        refresh_manager(receiver).await;
    });

    let shared_state = AppState { sender };

    let app = Router::new()
        .route("/:bid", get(subscribe).post(trigger))
        .with_state(shared_state);

    axum::serve(listener, app).await.unwrap();
}

async fn refresh_manager(mut receiver: Receiver<Refresh>) {
    let mut store: HashMap<String, oneshot::Sender<()>> = HashMap::new();
    while let Some(event) = receiver.recv().await {
        match event {
            Refresh::Subscribe { bid, trigger } => {
                println!("Subscribe {:?}", bid);
                store.insert(bid, trigger);
            }
            Refresh::Trigger { bid } => {
                println!("Trigger: {:?}", bid);
                let trigger = store.remove(&bid).unwrap();
                let _ = trigger.send(());
            }
        };
    }
}

async fn subscribe(Path(bid): Path<String>, State(state): State<AppState>) -> StatusCode {
    let handle = tokio::spawn(async move {
        let (sender, receiver) = oneshot::channel();
        state
            .sender
            .send(Refresh::Subscribe {
                bid: bid.clone(),
                trigger: sender,
            })
            .await
            .unwrap();

        let res = receiver.await;
        println!("refresh for {} was triggered, {:?}", bid, res)
    });
    let _ = handle.await;
    StatusCode::OK
}

async fn trigger(Path(bid): Path<String>, State(state): State<AppState>) -> StatusCode {
    let _ = state.sender.send(Refresh::Trigger { bid }).await;
    StatusCode::OK
}

async fn setup_redis(redis_pw: String) {
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

    // let mut master_connection = master
    //     .get_connection()
    //     .expect("Expected valid master client connection");

    let mut master_multiplexer = master
        .get_multiplexed_tokio_connection()
        .await
        .expect("Expected multiplexed tokio connection");

    let _: String = master_multiplexer
        .set("test", "super nice value async multiplexed")
        .await
        .expect("expected set command to succeed");

    let slave = redis::Client::open(ConnectionInfo {
        addr: ConnectionAddr::Tcp("127.0.0.1".into(), 6380),
        redis: conn_info,
    })
    .expect("Expected valid slave connection");

    let mut slave_connection = slave
        .get_connection()
        .expect("Expected valid slave client connection");

    let _: Result<String, RedisError> = slave_connection.set("test", "super bad  value");
    let slave_cmd: Result<String, RedisError> = slave_connection.get("test");

    match slave_cmd {
        Ok(value) => println!("{} from slave", value),
        Err(err) => println!("{}", err),
    }
}
