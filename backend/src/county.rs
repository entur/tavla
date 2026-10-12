use redis::{aio::MultiplexedConnection, AsyncCommands};
use serde::Deserialize;

const COUNTY_CACHE_TTL_SECS: u64 = 60 * 60 * 24 * 30; // 30 dager
const COUNTY_LOCK_TTL_SECS: u64 = 5; // sekunder - dekker tiden ett geocoder-kall tar
const GEOCODER_URL: &str = "https://api.entur.io/geocoder/v3/place";
const CLIENT_NAME: &str = "entur-tavla-backend";

#[derive(Deserialize)]
struct GeocoderResponse {
    features: Vec<GeocoderFeature>,
}

#[derive(Deserialize)]
struct GeocoderFeature {
    properties: GeocoderProperties,
}

#[derive(Deserialize)]
struct GeocoderProperties {
    address: Option<GeocoderAddress>,
}

#[derive(Deserialize)]
struct GeocoderAddress {
    county: Option<String>,
}

pub async fn resolve_county(redis: &mut MultiplexedConnection, nsr_id: &str) -> Option<String> {
    if !nsr_id.starts_with("NSR:StopPlace:") {
        return None; // quay-støtte kommer i en senere omgang
    }

    let cache_key = format!("county:{nsr_id}");

    if let Ok(cached) = redis.get::<_, String>(&cache_key).await {
        return Some(cached);
    }

    let lock_key = format!("county-lock:{nsr_id}");
    let acquired_lock: bool = redis::cmd("SET")
        .arg(&lock_key)
        .arg(1)
        .arg("NX")
        .arg("EX")
        .arg(COUNTY_LOCK_TTL_SECS)
        .query_async(redis)
        .await
        .unwrap_or(false);

    if !acquired_lock {
        return None; // noen andre henter allerede fylket akkurat nå - prøv igjen neste heartbeat
    }

    let county = fetch_county_from_geocoder(nsr_id).await?;

    let _: Result<(), _> = redis
        .set_ex(&cache_key, &county, COUNTY_CACHE_TTL_SECS)
        .await;

    Some(county)
}

async fn fetch_county_from_geocoder(nsr_id: &str) -> Option<String> {
    let url = format!("{GEOCODER_URL}?ids={nsr_id}");

    let response = reqwest::Client::new()
        .get(&url)
        .header("ET-Client-Name", CLIENT_NAME)
        .send()
        .await
        .ok()?;

    let body: GeocoderResponse = response.json().await.ok()?;

    body.features
        .first()?
        .properties
        .address
        .as_ref()?
        .county
        .clone()
}
