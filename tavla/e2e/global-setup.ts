import { promises as fs } from 'node:fs'
import path from 'node:path'
import { chromium, type FullConfig } from '@playwright/test'
import admin from 'firebase-admin'
import { TEST_USER } from './fixtures'

const PROJECT_ID = 'ent-tavla-dev'

function requireEnv(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(
            `${name} is not set — playwright.config.ts must set it before globalSetup runs`,
        )
    }
    return value
}

const AUTH_EMULATOR = requireEnv('FIREBASE_AUTH_EMULATOR_HOST')
const FIRESTORE_EMULATOR = requireEnv('FIRESTORE_EMULATOR_HOST')

const AUTH_DIR = path.join(__dirname, '.auth')
const STATE_FILE = path.join(AUTH_DIR, 'user.json')

async function resetEmulators() {
    const responses = await Promise.all([
        fetch(
            `http://${AUTH_EMULATOR}/emulator/v1/projects/${PROJECT_ID}/accounts`,
            { method: 'DELETE' },
        ),
        fetch(
            `http://${FIRESTORE_EMULATOR}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
            { method: 'DELETE' },
        ),
    ])
    for (const res of responses) {
        if (!res.ok) {
            throw new Error(`Emulator reset failed: ${res.status}`)
        }
    }
}

async function createTestUser() {
    if (admin.apps.length === 0) {
        admin.initializeApp({ projectId: PROJECT_ID })
    }

    await admin.auth().createUser({
        uid: TEST_USER.uid,
        email: TEST_USER.email,
        password: TEST_USER.password,
        emailVerified: true,
    })

    await admin
        .firestore()
        .collection('config')
        .doc('env')
        .set({ bucket: 'e2e-bucket' })
}

async function saveAuthState(baseURL: string) {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.route('**/web.cmp.usercentrics.eu/**', (route) => route.abort())
    await page.goto(`${baseURL}/?login=email`)
    await page.getByLabel('E-post').fill(TEST_USER.email)
    await page.getByLabel('Passord', { exact: true }).fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Logg inn', exact: true }).click()
    await page.waitForURL(/\/oversikt/, { timeout: 30_000 })

    await context.storageState({ path: STATE_FILE })
    await browser.close()
}

export default async function globalSetup(config: FullConfig) {
    const baseURL = config.projects[0]?.use.baseURL ?? 'http://localhost:3000'

    await fs.mkdir(AUTH_DIR, { recursive: true })
    await resetEmulators()
    await createTestUser()
    await saveAuthState(baseURL)
}
