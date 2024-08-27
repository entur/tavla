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

pub async fn setup_redis() -> (MultiplexedConnection, Client) {
    let redis_pw = std::env::var("REDIS_PASSWORD").expect("Expected to find redis pw");
    let conn_info = RedisConnectionInfo {
        db: 0,
        username: None,
        password: Some(redis_pw),
        protocol: redis::ProtocolVersion::RESP3,
    };

    let master_host = std::env::var("REDIS_MASTER_SERVICE_HOST")
        .expect("Expected to find redis master service host");
    let master_port = std::env::var("REDIS_MASTER_SERVICE_PORT")
        .expect("Expected to find redis master service port")
        .parse::<u16>()
        .expect("Expected redis master service port to be u16");

    let master = redis::Client::open(ConnectionInfo {
        addr: ConnectionAddr::Tcp(master_host, master_port),
        redis: conn_info.clone(),
    })
    .expect("Expected valid master connection");

    let master_multiplexer = master
        .get_multiplexed_tokio_connection()
        .await
        .expect("Expected multiplexed master connection");

    let replicas_host = std::env::var("REDIS_REPLICAS_SERVICE_HOST")
        .expect("Expected to find redis replicas service host");
    let replicas_port = std::env::var("REDIS_REPLICAS_SERVICE_PORT")
        .expect("Expected to find redis replicas service port")
        .parse::<u16>()
        .expect("Expected redis replicas service port to be u16");

    let replica = redis::Client::open(ConnectionInfo {
        addr: ConnectionAddr::Tcp(replicas_host, replicas_port),
        redis: conn_info,
    })
    .expect("Expected valid replica connection");

    (master_multiplexer, replica)
}
