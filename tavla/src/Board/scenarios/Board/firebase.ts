import { makeBoardCompatible } from 'app/(admin)/edit/[id]/compatibility'
import admin, { firestore } from 'firebase-admin'
import { TBoard, TBoardID, TOrganization } from 'types/settings'

initializeAdminApp()

async function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.GOOGLE_PROJECT_ID,
        })
    }
}

export async function getBoard(bid: TBoardID) {
    const board = await firestore().collection('boards').doc(bid).get()
    if (!board.exists) {
        return undefined
    }
    return makeBoardCompatible({ id: board.id, ...board.data() } as TBoard)
}

export async function getOrganizationWithBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()
    return ref.docs.map((doc) => doc.data() as TOrganization)[0] ?? null
}

export async function getOrganizationLogoWithBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()
    const organization = ref.docs.map((doc) => doc.data() as TOrganization)[0]
    return organization?.logo ?? null
}

export async function getOrganizationFooterWithBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()
    const organization = ref.docs.map((doc) => doc.data() as TOrganization)[0]
    return organization?.footer ?? null
}

export async function ping(bid: TBoardID) {
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.lastActive': Date.now() })
}
