use redis::{aio::MultiplexedConnection, Client};
use serde::Serialize;
use serde_json::Value;
use tokio_util::{sync::CancellationToken, task::TaskTracker};

#[derive(Clone)]
pub struct AppState {
    pub master: MultiplexedConnection,
    pub replicas: Client,
    pub runtime_status: CancellationToken,
    pub task_tracker: TaskTracker,
    pub key: String,
}

#[derive(Serialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Message {
    Refresh { payload: Value },
    Update,
}
