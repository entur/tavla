'use server'
import { firestore } from 'firebase-admin'
import {
    TOrganizationID,
    TOrganization,
    TBoard,
    TBoardID,
} from 'types/settings'
import { getUser, initializeAdminApp } from './utils/firebase'
import { getUserFromSessionCookie } from './utils/server'
import { chunk, concat, isEmpty, flattenDeep } from 'lodash'
import { TavlaError } from './utils/types'
import { redirect } from 'next/navigation'
import { FIREBASE_DEV_CONFIG, FIREBASE_PRD_CONFIG } from './utils/constants'
import { userInOrganization } from './utils'

initializeAdminApp()

export async function getFirebaseClientConfig() {
    const env = process.env.GOOGLE_PROJECT_ID
    if (env === 'ent-tavla-prd') return FIREBASE_PRD_CONFIG
    return FIREBASE_DEV_CONFIG
}

export async function getOrganizationIfUserHasAccess(oid?: TOrganizationID) {
    if (!oid) return undefined
    const doc = await firestore().collection('organizations').doc(oid).get()

    const organization = { ...doc.data(), id: doc.id } as TOrganization
    const user = await getUserFromSessionCookie()

    if (!userInOrganization(user?.uid, organization)) return redirect('/')
    return organization
}

export async function getOrganizationsForUser() {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    const owner = firestore()
        .collection('organizations')
        .where('owners', 'array-contains', user.uid)
        .get()

    const editor = firestore()
        .collection('organizations')
        .where('editors', 'array-contains', user.uid)
        .get()

    const queries = await Promise.all([owner, editor])
    return queries
        .map((q) =>
            q.docs.map((d) => ({ ...d.data(), id: d.id } as TOrganization)),
        )
        .flat()
}

export async function getBoardsForOrganization(oid: TOrganizationID) {
    const organization = await getOrganizationIfUserHasAccess(oid)
    if (!organization) return redirect('/')

    const boards = organization.boards
    if (isEmpty(boards)) return []

    const batchedBoardIDs = chunk(boards, 20)

    const boardQueries = batchedBoardIDs.map((batch) =>
        firestore()
            .collection('boards')
            .where(firestore.FieldPath.documentId(), 'in', batch)
            .get(),
    )

    const boardRefs = await Promise.all(boardQueries)

    return boardRefs
        .map((ref) =>
            ref.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TBoard)),
        )
        .flat()
}

export async function getPrivateBoardsForUser() {
    const user = await getUser()
    if (!user)
        throw new TavlaError({
            code: 'NOT_FOUND',
            message: `Found no user`,
        })

    const boardIDs = concat(user.owner ?? [], user.editor ?? [])

    if (isEmpty(boardIDs)) return []

    const batchedBoardIDs = chunk(boardIDs, 20)

    const boardQueries = batchedBoardIDs.map((batch) =>
        firestore()
            .collection('boards')
            .where(firestore.FieldPath.documentId(), 'in', batch)
            .get(),
    )

    const boardRefs = await Promise.all(boardQueries)

    return boardRefs
        .map((ref) =>
            ref.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TBoard)),
        )
        .flat()
}

export async function getBoards(ids?: TBoardID[]) {
    if (!ids) return []

    const batches = chunk(ids, 20)
    const queries = batches.map((batch) =>
        firestore()
            .collection('boards')
            .where(firestore.FieldPath.documentId(), 'in', batch)
            .get(),
    )

    const refs = await Promise.all(queries)
    return refs
        .map((ref) =>
            ref.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TBoard)),
        )
        .flat()
}

export async function getAllBoardsForUser() {
    const user = await getUser()
    if (!user) return redirect('/')

    const privateBoardIDs = concat(user.owner ?? [], user.editor ?? [])
    const privateBoards = (await getBoards(privateBoardIDs)).map((board) => ({
        board,
    }))

    const organizations = await getOrganizationsForUser()

    const organizationsBoards = flattenDeep(
        await Promise.all(
            organizations.map(async (organization) =>
                (
                    await getBoards(organization.boards)
                ).map((board) => ({
                    board,
                    organization,
                })),
            ),
        ),
    )
    return [...organizationsBoards, ...privateBoards]
}
