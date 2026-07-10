import admin from 'firebase-admin'

const PROJECT_ID = 'ent-tavla-dev'

export const TEST_USER = {
    email: 'e2e@tavla.test',
    password: 'e2etestpassword',
    uid: 'e2e-test-user',
} as const

function getAdminApp() {
    if (admin.apps.length === 0) {
        admin.initializeApp({ projectId: PROJECT_ID })
    }
    return admin.app()
}

export async function createTestBoard(title: string): Promise<string> {
    const db = getAdminApp().firestore()
    const now = Date.now()
    const boardRef = await db.collection('boards').add({
        meta: { title, created: now, dateModified: now },
        tiles: [],
        isCombinedTiles: false,
    })

    await db
        .collection('users')
        .doc(TEST_USER.uid)
        .set(
            { owner: admin.firestore.FieldValue.arrayUnion(boardRef.id) },
            { merge: true },
        )

    return boardRef.id
}
