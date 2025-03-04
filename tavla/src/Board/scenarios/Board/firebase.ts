import { makeBoardCompatible } from 'app/(admin)/edit/[id]/compatibility'
import admin, { firestore } from 'firebase-admin'
import {
    TBoard,
    TBoardID,
    TOrganization,
    TOrganizationID,
} from 'types/settings'
import * as Sentry from '@sentry/nextjs'

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
    try {
        const board = await firestore().collection('boards').doc(bid).get()
        if (!board.exists) {
            return undefined
        }
        return makeBoardCompatible({ id: board.id, ...board.data() } as TBoard)
    } catch (error) {
        Sentry.captureMessage('Failed to fetch board with bid ' + bid)
        throw error
    }
}

export async function getOrganizationById(oid: TOrganizationID) {
    try {
        const folder = await firestore()
            .collection('organizations')
            .doc(oid)
            .get()
        if (!folder.exists) {
            return undefined
        }
        return { id: folder.id, ...folder.data() } as TOrganization
    } catch (error) {
        Sentry.captureMessage('Failed to fetch organization with OID ' + oid)
        throw error
    }
}

export async function getOrganizationWithBoard(bid: TBoardID) {
    try {
        const ref = await firestore()
            .collection('organizations')
            .where('boards', 'array-contains', bid)
            .get()
        return ref.docs.map((doc) => doc.data() as TOrganization)[0] ?? null
    } catch (error) {
        Sentry.captureMessage('Failed to fetch organization with board ' + bid)
        throw error
    }
}

export async function getOrganizationLogoWithBoard(bid: TBoardID) {
    try {
        const ref = await firestore()
            .collection('organizations')
            .where('boards', 'array-contains', bid)
            .get()
        const organization = ref.docs.map(
            (doc) => doc.data() as TOrganization,
        )[0]
        return organization?.logo ?? null
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while fetching logo of organization of board',
                boardID: bid,
            },
        })
        return null
    }
}

export async function getOrganizationFooterWithBoard(bid: TBoardID) {
    try {
        const ref = await firestore()
            .collection('organizations')
            .where('boards', 'array-contains', bid)
            .get()
        const organization = ref.docs.map(
            (doc) => doc.data() as TOrganization,
        )[0]
        return organization?.footer ?? null
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while fetching organization footer for board from firestore',
                boardID: bid,
            },
        })
        return null
    }
}

export async function ping(bid: TBoardID) {
    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({ 'meta.lastActive': Date.now() })
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while updating lastActive-field of board (ping)',
                boardID: bid,
            },
        })
    }
}
