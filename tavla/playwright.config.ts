import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'

const AUTH_STATE = path.join(__dirname, 'e2e/.auth/user.json')

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
        baseURL: 'http://localhost:3000',
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
        command:
            'yarn firebase emulators:exec --only auth,firestore,storage --project=ent-tavla-dev "yarn next dev"',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
        env: {
            FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
            FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
            FIREBASE_STORAGE_EMULATOR_HOST: '127.0.0.1:9199',
            GOOGLE_PROJECT_ID: 'ent-tavla-dev',
            NEXT_PUBLIC_ENV: 'dev',
        },
    },
})
