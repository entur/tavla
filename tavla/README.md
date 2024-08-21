# Getting Started

## Prerequisites

To run the project locally, you need to have the following installed:

-   [Node.js](https://nodejs.org/)
-   [Yarn](https://yarnpkg.com/)

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/entur/tavla.git
cd tavla/next-tavla
yarn install
```

## Running the application

To start the application in development mode, use:

```bash
yarn dev
# or
yarn dev:persist #persists the local database
```

This will start the development server at `http://localhost:3000`

## Environment variables

You need to set some environment variables in, create a `.env.local` file at the root of `/next-tavla`.

```sh
GCLOUD_PROJECT="ent-tavla-dev"
GOOGLE_APPLICATION_CREDENTIALS="secret"
BACKEND_API_KEY="secret_key"
NEXT_PUBLIC_POSTHOG_KEY="secret_key"
NEXT_PUBLIC_POSTHOG_HOST="https://eu.posthog.com"
```
