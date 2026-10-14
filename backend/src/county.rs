use redis::{aio::MultiplexedConnection, AsyncCommands};
use serde::Deserialize;
use std::sync::LazyLock;
use std::time::Duration;

const COUNTY_CACHE_TTL_SECS: u64 = 60 * 60 * 24 * 30; // 30 dager
const COUNTY_LOCK_TTL_SECS: u64 = 10; // sekunder - dekker tiden ett geocoder-kall tar
const FETCH_TIMEOUT_SECS: u64 = 2;
const GEOCODER_URL: &str = "https://api.entur.io/geocoder/v3/place";
const GEOCODER_REVERSE_URL: &str = "https://api.entur.io/geocoder/v3/reverse";
const STOP_PLACE_REGISTER_URL: &str = "https://api.entur.io/stop-places/v1/read";
const CLIENT_NAME: &str = "entur-tavla-backend";

static CLIENT: LazyLock<reqwest::Client> = LazyLock::new(|| {
    reqwest::Client::builder()
        .timeout(Duration::from_secs(FETCH_TIMEOUT_SECS))
        .build()
        .expect("failed to build geocoder http client")
});

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

#[derive(Deserialize)]
struct QuayResponse {
    centroid: QuayCentroid,
}

#[derive(Deserialize)]
struct QuayCentroid {
    location: QuayLocation,
}

#[derive(Deserialize)]
struct QuayLocation {
    latitude: f64,
    longitude: f64,
}

pub async fn resolve_county(redis: &mut MultiplexedConnection, nsr_id: &str) -> Option<String> {
    if !nsr_id.starts_with("NSR:StopPlace:") && !nsr_id.starts_with("NSR:Quay:") {
        return None;
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

    let county = if nsr_id.starts_with("NSR:Quay:") {
        let (lat, lon) = fetch_quay_coordinates(nsr_id).await?;
        fetch_county_geocoder_reverse(lat, lon).await?
    } else {
        fetch_county_geocoder_place(nsr_id).await?
    };

    let _: Result<(), _> = redis
        .set_ex(&cache_key, &county, COUNTY_CACHE_TTL_SECS)
        .await;

    Some(county)
}

async fn fetch_quay_coordinates(quay_id: &str) -> Option<(f64, f64)> {
    let url = format!("{STOP_PLACE_REGISTER_URL}/quays/{quay_id}");

    let response = CLIENT
        .get(&url)
        .header("ET-Client-Name", CLIENT_NAME)
        .send()
        .await
        .ok()?;

    let body: QuayResponse = response.json().await.ok()?;

    Some((
        body.centroid.location.latitude,
        body.centroid.location.longitude,
    ))
}

async fn fetch_county_from_url(url: &str) -> Option<String> {
    let response = CLIENT
        .get(url)
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

async fn fetch_county_geocoder_place(nsr_id: &str) -> Option<String> {
    fetch_county_from_url(&format!("{GEOCODER_URL}?ids={nsr_id}")).await
}

async fn fetch_county_geocoder_reverse(lat: f64, lon: f64) -> Option<String> {
    fetch_county_from_url(&format!(
        "{GEOCODER_REVERSE_URL}?lat={lat}&lon={lon}&limit=1&layers=address"
    ))
    .await
}
