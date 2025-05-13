# Getting Started

## Prerequisites

To run the project locally, you need to have the following installed:

-   [node.js](https://nodejs.org/)
-   [yarn](https://yarnpkg.com/)

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/entur/tavla.git
cd tavla/tavla
yarn install
```

To access the Firebase database and being able to create a user and log into the application, two service keys are required; `ent-tavla-dev-875a70280651.json` and `ent-tavla-prd-54ef424ea2f0.json`. These files should be placed in `tavla/tavla`.

### Node Version Configuration (using `mise`)

The project is currently using node v18.20.5. `mise` can be used to configure the right node version, see https://mise.jdx.dev/.

Example (here with `brew` and `bash`):

1. Install mise

    ```bash
    brew install mise
    ```

2. Activate mise - https://mise.jdx.dev/getting-started.html#activate-mise

    ```bash
    echo 'eval "$(mise activate bash)"' >> ~/.bashrc
    ```

3. Check current node version
    ```bash
    node -v
    # v18.20.5
    ```

## Running the Application

To start the application in development mode, use:

```bash
yarn dev
# or
yarn dev:persist # preffered - persists the local database
```

This will start the development server at `http://localhost:3000` and the local Firebase database emulator `http://127.0.0.1:4000/`.

To access the Firebase database and being able to create a user and log into the application, two service keys are required; `ent-tavla-dev-875a70280651.json` and `ent-tavla-prd-54ef424ea2f0.json`. These files should be placed in `tavla/tavla`.

## Environment Configuration

The project integrates with Sentry for error tracking and performance monitoring. However, Sentry is not required for running the application locally or in development mode. If you want to use Sentry, follow these steps:

1. Create a `.env.local` file in the root of the project (if it does not already exist).
2. Add the content in the team's LastPass to your `.env.local` file.

<br />

## Running the Migration Script

The `migration` script in the "migrations"-folder can take in two arguments - either 'setup' or 'run'. Usage of these as follows:

1. Setting up the environment for the first time:

    From the root of the migrations-folder run:

    ```bash
    ./migration setup
    ```

2. Running a migration file through the script:

    From the root of the migrations-folder run:

    ```bash
    ./migration run path/to/filename.py
    ```
