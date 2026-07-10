import { promises as fs } from 'node:fs'
import path from 'node:path'
import { chromium, type FullConfig } from '@playwright/test'
import admin from 'firebase-admin'

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

export const TEST_USER = {
    email: 'e2e@tavla.test',
    password: 'e2etestpassword',
    uid: 'e2e-test-user',
} as const

const AUTH_DIR = path.join(__dirname, '.auth')
const STATE_FILE = path.join(AUTH_DIR, 'user.json')
const SEED_FILE = path.join(AUTH_DIR, 'seed.json')

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

async function seedFirebase() {
    if (admin.apps.length === 0) {
        admin.initializeApp({ projectId: PROJECT_ID })
    }
    const auth = admin.auth()
    const db = admin.firestore()

    await auth.createUser({
        uid: TEST_USER.uid,
        email: TEST_USER.email,
        password: TEST_USER.password,
        emailVerified: true,
    })

    const now = Date.now()
    const boardRef = await db.collection('boards').add({
        meta: { title: 'E2E seed board', created: now, dateModified: now },
        tiles: [],
        isCombinedTiles: false,
    })

    await db
        .collection('users')
        .doc(TEST_USER.uid)
        .set({ owner: [boardRef.id] })
    await db.collection('config').doc('env').set({ bucket: 'e2e-bucket' })

    return boardRef.id
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
    const boardId = await seedFirebase()
    await fs.writeFile(SEED_FILE, JSON.stringify({ boardId }, null, 2))
    await saveAuthState(baseURL)
}
