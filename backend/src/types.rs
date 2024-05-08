use redis::{aio::MultiplexedConnection, Client};
use tokio_util::{sync::CancellationToken, task::TaskTracker};

#[derive(Clone)]
pub struct AppState {
    pub master: MultiplexedConnection,
    pub replicas: Client,
    pub runtime_status: CancellationToken,
    pub task_tracker: TaskTracker,
}
