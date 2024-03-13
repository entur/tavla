FROM messense/rust-musl-cross:x86_64-musl AS builder

WORKDIR /redirect

COPY . .

RUN cargo build --release --target x86_64-unknown-linux-musl

FROM alpine:3.18 AS runner

COPY --from=builder /redirect/target/x86_64-unknown-linux-musl/release/redirect /redirect

EXPOSE 3000
CMD ["/redirect"]
