use redis::{
    aio::MultiplexedConnection, Client, ConnectionAddr, ConnectionInfo, RedisConnectionInfo,
};
use tokio::signal;
use tokio_util::{sync::CancellationToken, task::TaskTracker};

pub async fn graceful_shutdown(cancellation_token: CancellationToken, tracker: TaskTracker) {
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

/// Classifies a User-Agent string as mobile or not. Only trusts the explicit
/// mobile tokens browsers set deliberately (Android phones include "Mobile",
/// iPhones/iPods, Windows Phone, BlackBerry, Opera Mini) - this is reliable.
pub fn is_mobile_user_agent(user_agent: &str) -> bool {
    let ua = user_agent.to_lowercase();
    [
        "mobi",
        "iphone",
        "ipod",
        "blackberry",
        "windows phone",
        "opera mini",
    ]
    .iter()
    .any(|token| ua.contains(token))
}

// Values a boolean session label (`is_mobile`, `is_direct_link`) can take.
pub const BOOL_LABEL_VALUES: [&str; 2] = ["true", "false"];

pub fn bool_label(value: bool) -> &'static str {
    if value {
        "true"
    } else {
        "false"
    }
}

pub async fn setup_redis() -> (MultiplexedConnection, Client) {
    let redis_pw = std::env::var("REDIS_PASSWORD").ok();
    let conn_info = RedisConnectionInfo {
        db: 0,
        username: None,
        password: redis_pw,
        protocol: redis::ProtocolVersion::RESP3,
    };

    let redis_host = std::env::var("REDIS_HOST").expect("Expected to find redis host");
    let redis_port = std::env::var("REDIS_PORT")
        .expect("Expected to find redis port")
        .parse::<u16>()
        .expect("Expected redis port to be u16");

    let master = redis::Client::open(ConnectionInfo {
        addr: ConnectionAddr::Tcp(redis_host.clone(), redis_port),
        redis: conn_info.clone(),
    })
    .expect("Expected valid master connection");

    let master_multiplexer = master
        .get_multiplexed_tokio_connection()
        .await
        .expect("Expected multiplexed master connection");

    let replica = redis::Client::open(ConnectionInfo {
        addr: ConnectionAddr::Tcp(redis_host, redis_port),
        redis: conn_info,
    })
    .expect("Expected valid replica connection");

    (master_multiplexer, replica)
}
