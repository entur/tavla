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

pub const NORWEGIAN_COUNTIES: [&str; 15] = [
    "Oslo",
    "Trøndelag",
    "Akershus",
    "Vestland",
    "Innlandet",
    "Møre og Romsdal",
    "Troms",
    "Nordland",
    "Rogaland",
    "Østfold",
    "Buskerud",
    "Agder",
    "Finnmark",
    "Vestfold",
    "Telemark",
];

const COUNTY_OTHER: &str = "Annet";
const COUNTY_NA: &str = "N/A";

// Values the `county` session label can take: the fylker in NORWEGIAN_COUNTIES,
// COUNTY_OTHER for any other non-empty value (e.g. Swedish counties near the
// border), or COUNTY_NA if the heartbeat didn't include a county at all.
// Derived from NORWEGIAN_COUNTIES rather than duplicated, so the two lists
// can't drift out of sync.
const fn build_county_label_values() -> [&'static str; NORWEGIAN_COUNTIES.len() + 2] {
    let mut values = [""; NORWEGIAN_COUNTIES.len() + 2];
    let mut i = 0;
    while i < NORWEGIAN_COUNTIES.len() {
        values[i] = NORWEGIAN_COUNTIES[i];
        i += 1;
    }
    values[NORWEGIAN_COUNTIES.len()] = COUNTY_OTHER;
    values[NORWEGIAN_COUNTIES.len() + 1] = COUNTY_NA;
    values
}

pub const COUNTY_LABEL_VALUES: [&str; NORWEGIAN_COUNTIES.len() + 2] = build_county_label_values();

// Lowercased once at first use rather than re-lowercasing every county name on every lookup.
static NORWEGIAN_COUNTIES_LOWER: std::sync::LazyLock<[String; NORWEGIAN_COUNTIES.len()]> =
    std::sync::LazyLock::new(|| NORWEGIAN_COUNTIES.map(|county| county.to_lowercase()));

pub fn county_label(raw: Option<&str>) -> &'static str {
    match raw.filter(|c| !c.is_empty()) {
        Some(c) => {
            let c_lower = c.to_lowercase();
            NORWEGIAN_COUNTIES_LOWER
                .iter()
                .position(|county| *county == c_lower)
                .map(|i| NORWEGIAN_COUNTIES[i])
                .unwrap_or(COUNTY_OTHER)
        }
        None => COUNTY_NA,
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
