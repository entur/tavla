import admin, { firestore } from 'firebase-admin'
import { TBoard, TBoardID, TOrganization } from 'types/settings'

initializeAdminApp()

async function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp()
    }
}

export async function getBoard(bid: TBoardID) {
    const board = await firestore().collection('boards').doc(bid).get()
    return { id: board.id, ...board.data() } as TBoard
}

export async function getOrganizationLogoWithBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()
    const organization = ref.docs.map((doc) => doc.data() as TOrganization)[0]
    return organization?.logo ?? null
}
