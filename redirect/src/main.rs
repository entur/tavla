use http_body_util::Empty;
use hyper::{
    body::Bytes, header, server::conn::http1, service::service_fn, Request, Response, StatusCode,
};
use hyper_util::rt::TokioIo;
use std::convert::Infallible;
use std::net::SocketAddr;
use tokio::net::TcpListener;

const TAVLA_URL: &str = "https://tavla.beta.entur.no";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    let listener = TcpListener::bind(addr).await?;

    loop {
        let (stream, _) = listener.accept().await?;

        let io = TokioIo::new(stream);

        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .serve_connection(io, service_fn(redirect))
                .await
            {
                println!("error serving connection: {:?}", err);
            }
        });
    }
}

async fn redirect(
    req: Request<hyper::body::Incoming>,
) -> Result<Response<Empty<Bytes>>, Infallible> {
    Ok(Response::builder()
        .header(header::LOCATION, format!("{}{}", TAVLA_URL, req.uri()))
        .status(StatusCode::TEMPORARY_REDIRECT)
        .body(Empty::new())
        .unwrap())
}
