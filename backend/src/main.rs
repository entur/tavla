use std::{collections::HashMap, thread::sleep, time::Duration};

use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::get,
    Router,
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

    let listener = TcpListener::bind(format!("{}:{}", host, port))
        .await
        .unwrap();

    let (sender, receiver) = tokio::sync::mpsc::channel::<Refresh>(32);

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
