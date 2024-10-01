# Run instructions

## Install Rust

The recommended way to install and manage Rust is with the rustup tool:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Install Redis

The code depends on Redis. Download Redis here:
[Redis](https://redis.io/docs/latest/get-started/)

## Start Redis

Since we run our stack on Kubernetes we need to mock a master/replica structure locally (You could run the stack in its entirity on a local Kubernetes cluster, like Minikube. Do this on your own discretion)

First, start the master instance. Executing the `redis-server` command with `-` as an input will put us in a state where we are reading configurations directly from stdin. We need to set the password for both the master and the replicas.

```sh
redis-server -
```

Your terminal should look like this:

```sh
~ > redis-server -
82635:C 20 Aug 2024 10:20:39.350 * Reading config from stdin

```

You can now type in the required configuration:

```sh
masterauth super_secret_redis_pw
requirepass super_secret_redis_pw
```

Your terminal should now look like this:

```sh
~ > redis-server -
82635:C 20 Aug 2024 10:20:39.350 * Reading config from stdin
masterauth super_secret_redis_pw
requirepass super_secret_redis_pw
```

Finish configuring the first instance with `CTRL-D`

Start the second instance in a new window/terminal

```sh
redis-server -
```

Your terminal should look like this:

```sh
~ > redis-server -
82635:C 20 Aug 2024 10:20:39.350 * Reading config from stdin

```

You can now type in the required configuration:

```sh
masterauth super_secret_redis_pw
requirepass super_secret_redis_pw
port 6380
replicaof 127.0.0.1 6379
```

Your terminal should now look like this:

```sh
~ > redis-server -
82635:C 20 Aug 2024 10:20:39.350 * Reading config from stdin
masterauth super_secret_redis_pw
requirepass super_secret_redis_pw
port 6380
replicaof 127.0.0.1 6379
```

Finish configuring the second instance with `CTRL-D`

## Verify Redis

You should now be able to connect directly to Redis. Open a new terminal and run the following:

```sh
redis-cli
```

Authenticate yourself

```sh
auth super_secret_redis_pw
```

Set active_boards (A counter that keeps tracks of currently active boards) to 0

```sh
set active_boards 0
```

Quit Redis with `CTRL-C`

## Environment variables

You need to set some environment variables. Paste them directly into your terminal.

```sh
export HOST="127.0.0.1"
export PORT="3001"
export BACKEND_API_KEY="super_secret_key"
export REDIS_PASSWORD="super_secret_redis_pw"
export REDIS_MASTER_SERVICE_HOST="127.0.0.1"
export REDIS_MASTER_SERVICE_PORT="6379"
export REDIS_REPLICAS_SERVICE_HOST="127.0.0.1"
export REDIS_REPLICAS_SERVICE_PORT="6380"
```

## Run

Finally, you can run the code. Make sure you are in the backend-folder when doing so.

```sh
cargo run
```

## Verify

You should now be able to send requests to the server

```sh
curl localhost:3001/active -H "Authorization: Bearer super_secret_key"
```

This should return 0 (since you just set the active_boards-counter to 0).

## Connect to frontend

To connect your local backend to the frontend, you need to (TEMPORARILY) change the backendurl to point to your local backend. Do NOT commit this change.

Go to `tavla/src/Shared/utils/index.ts` and change the `getBackendUrl`-function to the following:

```
export function getBackendUrl() {
    return 'http://127.0.0.1:3001'
}
```

For your frontend to access your local backend, make sure you have a file named `.env.local` at the root of tavla/tavla that contains the following:

```
BACKEND_API_KEY="super_secret_key"
```

Do not add this file to git. You should now be able to press "Oppdater tavle" successfully on localhost.
