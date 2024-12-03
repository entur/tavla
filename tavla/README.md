# Getting Started

## Prerequisites

To run the project locally, you need to have the following installed:

-   [Node.js](https://nodejs.org/)
-   [Yarn](https://yarnpkg.com/)

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/entur/tavla.git
cd tavla/tavla
yarn install
```

## Environment Configuration

The project integrates with Sentry for error tracking and performance monitoring. However, Sentry is not required for running the application locally or in development mode. If you want to use Sentry, follow these steps:

1. Create a `.env.local` file in the root of the project (if it doesn’t already exist).
2. Add the following lines to your `.env.local` file:

```bash
NEXT_PUBLIC_SENTRY_DSN_URL=your-sentry-dsn-url
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

Replace `your-sentry-dsn-url` and `your-sentry-auth-token` with the DSN provided by your Sentry project.

## Running the Application

To start the application in development mode, use:

```bash
yarn dev
# or
yarn dev:persist # persists the local database
```

This will start the development server at `http://localhost:3000`.
