#[derive(Serialize, Deserialize)]
pub struct ActivePayload {
    pub bid: Uuid,
    pub tid: Uuid,
    pub browser: String,
    pub screen_width: u32, // uint siden da kan ikke bredden være negativ
    pub screen_width: u32,
}

#[derive(Serialize, Deserialize)]
pub struct ActiveInfo {
    pub bid: Uuid,
    pub browser: String,
    pub screen_width: u32,
    pub screen_width: u32,
}

// Skal være endepunkt som tar i mot (?) info fra en "aktiv" nettside hvert 60 sekund
async fn heartbeat(
    AuthBearer(token): AuthBearer,
    State(state): State<AppState>,
    Json(payload): Json<ActivePayload>,
) -> Result<StatusCode, AppError> {
    if token != state.key {
        Ok(StatusCode::UNAUTHORIZED)
    }

    let mut connection = state.master.clone();

    let key = format!("heartbeat:{}:{}", payload.bid, payload.tid);

    // må handle serde errors i AppError da for å få dette til å fungere
    let value = serde_json::to_string(ActiveInfo{bid: payload.bid, browser: payload.browser, screen_width: payload.screen_width, screen_height: payload.screen_height})?;

    let _: () = connection.set_ex(key, value.to_string(), 60).await?;

    Ok(StatusCode::OK)
}










#[derive(Serialize, Deserialize)]
pub struct HeartbeatResponse {
    pub count: u32,
    pub clients: Vec<String>
}

// Skal forhåpentligvis gi et tall og info om alle disse aktive tavlene
async fn active_boards_heartbeat(
    AuthBearer(token): AuthBearer,
    State(mut state): State<AppState>,
) -> Result<Json(HeartbeatResponse)>, AppError> {
    if token != state.key {
        // treger vi body her? kan man ikke bare returnere en app error som mapper til bad request?
        AppError::Unauthrized()
    }

    let mut connection = state.replicas.clone();

    let keys: Vec<String> = redis::cmd("KEYS")
        .arg("heartbeat:*")
        .query_async(&mut connection)
        .await?;

    // kan hende dette ikke er helt riktig men noe sånt er litt mer rust like
    let clients = keys.into_iter().map(|id| async {
       let val = connection.get::<_, String>(key).await?;
       // denne burde egt bli parsed til en forventet sturct
       serde_json::from_str::<serde_json::Value>(&value)
    }).
    .filter_map(Result::ok)
    .collect();

    // skal det være key.len eller clients.len?
    Ok(Json(HeartbeatResponse{count: keys.len(), clients}))