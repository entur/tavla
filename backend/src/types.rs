use axum::{
    body::Body,
    http::{Response, StatusCode},
    response::IntoResponse,
};
use redis::{aio::MultiplexedConnection, Client};
use serde::Serialize;
use serde_json::{to_string, Value};
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
    Timeout,
}

impl IntoResponse for Message {
    fn into_response(self) -> axum::response::Response {
        if let Ok(json_string) = to_string(&self) {
            if let Ok(res) = Response::builder()
                .header("Content-type", "application/json")
                .body(Body::from(json_string))
            {
                return res;
            }
        }
        StatusCode::INTERNAL_SERVER_ERROR.into_response()
    }
}

pub struct AppError(anyhow::Error);

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        (StatusCode::INTERNAL_SERVER_ERROR).into_response()
    }
}

impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}
