import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'

const AUTH_STATE = path.join(__dirname, 'e2e/.auth/user.json')
const PROJECT_ID = 'ent-tavla-dev'

type Ports = {
    auth: number
    firestore: number
    storage: number
    ui: number
    next: number
}

// Playwright reloads this config in every worker process. Only the root
// process (no TEST_WORKER_INDEX yet) should pick fresh ports; workers must
// reuse the same ports the root process already started webServer with.
const portsFile = path.join(__dirname, 'e2e/.ports.json')
let ports: Ports
if (process.env.TEST_WORKER_INDEX === undefined) {
    ports = JSON.parse(
        execFileSync('node', [path.join(__dirname, 'e2e/pick-ports.mjs')], {
            encoding: 'utf-8',
        }),
    )
    fs.writeFileSync(portsFile, JSON.stringify(ports))
} else {
    ports = JSON.parse(fs.readFileSync(portsFile, 'utf-8'))
}

const baseFirebaseConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'firebase.json'), 'utf-8'),
)
const e2eFirebaseConfigPath = path.join(__dirname, 'firebase.e2e.json')
fs.writeFileSync(
    e2eFirebaseConfigPath,
    JSON.stringify(
        {
            ...baseFirebaseConfig,
            emulators: {
                ...baseFirebaseConfig.emulators,
                auth: {
                    ...baseFirebaseConfig.emulators.auth,
                    port: ports.auth,
                },
                firestore: {
                    ...baseFirebaseConfig.emulators.firestore,
                    port: ports.firestore,
                },
                storage: {
                    ...baseFirebaseConfig.emulators.storage,
                    port: ports.storage,
                },
                ui: { ...baseFirebaseConfig.emulators.ui, port: ports.ui },
            },
        },
        null,
        4,
    ),
)

process.env.FIREBASE_AUTH_EMULATOR_HOST = `127.0.0.1:${ports.auth}`
process.env.FIRESTORE_EMULATOR_HOST = `127.0.0.1:${ports.firestore}`
process.env.FIREBASE_STORAGE_EMULATOR_HOST = `127.0.0.1:${ports.storage}`
process.env.GOOGLE_PROJECT_ID = PROJECT_ID

const baseURL = `http://localhost:${ports.next}`

export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    reporter: process.env.CI ? [['github'], ['html']] : 'list',
    timeout: 60_000,
    expect: { timeout: 10_000 },
    use: {
        baseURL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    globalSetup: require.resolve('./e2e/global-setup.ts'),
    projects: [
        {
            name: 'anonymous',
            use: { ...devices['Desktop Chrome'] },
            testMatch: /(auth|public-api)\.spec\.ts/,
        },
        {
            name: 'authenticated',
            use: { ...devices['Desktop Chrome'], storageState: AUTH_STATE },
            testMatch: /(board-create|board-edit)\.spec\.ts/,
        },
    ],
    webServer: {
        command: `yarn firebase emulators:exec --only auth,firestore,storage --project=${PROJECT_ID} --config firebase.e2e.json "yarn next dev -p ${ports.next}"`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
        env: {
            FIREBASE_AUTH_EMULATOR_HOST:
                process.env.FIREBASE_AUTH_EMULATOR_HOST,
            FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST,
            FIREBASE_STORAGE_EMULATOR_HOST:
                process.env.FIREBASE_STORAGE_EMULATOR_HOST,
            GOOGLE_PROJECT_ID: PROJECT_ID,
            NEXT_PUBLIC_ENV: 'dev',
            NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT: String(ports.auth),
            NEXT_DIST_DIR: '.next-e2e',
        },
    },
})
