use axum::{
    body::Body,
    http::{Response, StatusCode},
    response::IntoResponse,
};
use redis::{
    aio::MultiplexedConnection, from_redis_value, AsyncCommands, Client, FromRedisValue,
    ToRedisArgs,
};
use serde::{Deserialize, Serialize};
use serde_json::{to_string, Value};

#[derive(Clone)]
pub struct AppState {
    pub master: MultiplexedConnection,
    pub replicas: Client,
    pub key: String,
}

#[derive(Serialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Message {
    Refresh { payload: Value },
    Update,
    Timeout,
}

#[derive(Serialize, Deserialize)]
pub enum BoardAction {
    Refresh { payload: Value },
    Update,
}

impl FromRedisValue for BoardAction {
    fn from_redis_value(v: &redis::Value) -> redis::RedisResult<Self> {
        let s: String = from_redis_value(v)?;
        Ok(serde_json::from_str::<BoardAction>(&s)?)
    }
}

impl ToRedisArgs for BoardAction {
    fn write_redis_args<W>(&self, out: &mut W)
    where
        W: ?Sized + redis::RedisWrite,
    {
        let s = serde_json::to_string(self);

        match s {
            Ok(s) => out.write_arg_fmt(s),
            Err(_) => out.write_arg_fmt(0_u8),
        }
    }
}

pub struct Guard {
    pub master: MultiplexedConnection,
}

impl Guard {
    pub fn new(master: MultiplexedConnection) -> Self {
        let mut m = master.clone();
        tokio::spawn(async move {
            let _ = m.incr::<&str, i32, i32>("active_boards", 1).await;
        });
        Guard { master }
    }
}

impl Drop for Guard {
    fn drop(&mut self) {
        let mut m = self.master.clone();
        tokio::spawn(async move {
            let _ = m.decr::<&str, i32, i32>("active_boards", 1).await;
        });
    }
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

pub struct AppError {
    _e: anyhow::Error,
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        StatusCode::INTERNAL_SERVER_ERROR.into_response()
    }
}

impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self { _e: err.into() }
    }
}
