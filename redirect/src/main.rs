use axum::{extract::Request, handler::HandlerWithoutStateExt, response::Redirect};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let host = std::env::var("HOST").unwrap_or("0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or("3000".to_string());

    let listener = TcpListener::bind(format!("{}:{}", host, port))
        .await
        .unwrap();

    axum::serve(listener, tower::make::Shared::new(redirect.into_service()))
        .await
        .unwrap();
}

async fn redirect(request: Request) -> Redirect {
    let target = std::env::var("TARGET").unwrap_or("https://tavla.entur.no".to_string());
    Redirect::temporary(format!("{}{}", target, request.uri()).as_str())
}
