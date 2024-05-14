FROM messense/rust-musl-cross:x86_64-musl AS builder

WORKDIR /backend

COPY . .

RUN cargo build --release --target x86_64-unknown-linux-musl

FROM alpine:3.18 AS runner

COPY --from=builder /backend/target/x86_64-unknown-linux-musl/release/backend /backend

EXPOSE 3000
CMD ["/backend"]
