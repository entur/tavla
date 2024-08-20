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

## Environment variables

You need to set some environment variables.

```sh
export HOST="127.0.0.1"
export PORT="3001"
export BACKEND_API_KEY="super_secret_key"
export REDIS_PASSWORD="super_secret_redis_pw"
export REDIS_MASTER_SERVICE_HOST="127.0.0.1"
export REDIS_MASTER_SERVICE_PORT="6379"
export REDIS_REPLICAS_SERVICE_HOST"127.0.0.1"
export REDIS_REPLICAS_SERVICE_PORT="6380"
```

## Run
Finally, you can run the code

```sh
cargo run
```