import { getApp, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const PROJECT_ID = 'ent-tavla-dev'

export const TEST_USER = {
    email: 'e2e@tavla.test',
    password: 'e2etestpassword',
    uid: 'e2e-test-user',
} as const

function getAdminApp() {
    if (getApps().length === 0) {
        initializeApp({ projectId: PROJECT_ID })
    }
    return getApp()
}

export async function createTestBoard(title: string): Promise<string> {
    const db = getFirestore(getAdminApp())
    const now = Date.now()
    const boardRef = await db.collection('boards').add({
        meta: { title, created: now, dateModified: now },
        tiles: [],
        isCombinedTiles: false,
    })

    await db
        .collection('users')
        .doc(TEST_USER.uid)
        .set({ owner: FieldValue.arrayUnion(boardRef.id) }, { merge: true })

    return boardRef.id
}
