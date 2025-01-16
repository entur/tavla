'use server'
import { firestore } from 'firebase-admin'
import {
    TOrganizationID,
    TOrganization,
    TBoard,
    TBoardID,
} from 'types/settings'
import { getUserWithBoardIds, initializeAdminApp } from './utils/firebase'
import { getUserFromSessionCookie } from './utils/server'
import { chunk, isEmpty, flattenDeep } from 'lodash'
import { redirect } from 'next/navigation'
import { FIREBASE_DEV_CONFIG, FIREBASE_PRD_CONFIG } from './utils/constants'
import { userInOrganization } from './utils'
import * as Sentry from '@sentry/nextjs'

initializeAdminApp()

export async function getFirebaseClientConfig() {
    const env = process.env.GOOGLE_PROJECT_ID
    if (env === 'ent-tavla-prd') return FIREBASE_PRD_CONFIG
    return FIREBASE_DEV_CONFIG
}

export async function getOrganizationIfUserHasAccess(oid?: TOrganizationID) {
    if (!oid) return undefined

    let doc = null

    try {
        doc = await firestore().collection('organizations').doc(oid).get()
        if (!doc) throw Error('Fetch org returned null or undefined')
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching organization from firestore, orgID: ' + oid,
        )
        throw error
    }

    const organization = { ...doc.data(), id: doc.id } as TOrganization
    const user = await getUserFromSessionCookie()

    if (!userInOrganization(user?.uid, organization)) return redirect('/')
    return organization
}

export async function getOrganizationsForUser() {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    try {
        const owner = firestore()
            .collection('organizations')
            .where('owners', 'array-contains', user.uid)
            .get()

        const queries = await Promise.all([owner])
        return queries
            .map((q) =>
                q.docs.map((d) => ({ ...d.data(), id: d.id }) as TOrganization),
            )
            .flat()
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching organizations for user with id ' + user.uid,
        )
        throw error
    }
}

export async function getBoardsForOrganization(oid: TOrganizationID) {
    const organization = await getOrganizationIfUserHasAccess(oid)
    if (!organization) return redirect('/')

    const boards = organization.boards
    if (isEmpty(boards)) return []

    const batchedBoardIDs = chunk(boards, 20)

    try {
        const boardQueries = batchedBoardIDs.map((batch) =>
            firestore()
                .collection('boards')
                .where(firestore.FieldPath.documentId(), 'in', batch)
                .get(),
        )

        const boardRefs = await Promise.all(boardQueries)

        return boardRefs
            .map((ref) =>
                ref.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() }) as TBoard,
                ),
            )
            .flat()
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching boards for organization with orgID ' + oid,
        )
        throw error
    }
}

export async function getBoards(ids?: TBoardID[]) {
    if (!ids) return []

    const batches = chunk(ids, 20)
    try {
        const queries = batches.map((batch) =>
            firestore()
                .collection('boards')
                .where(firestore.FieldPath.documentId(), 'in', batch)
                .get(),
        )

        const refs = await Promise.all(queries)
        return refs
            .map((ref) =>
                ref.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() }) as TBoard,
                ),
            )
            .flat()
    } catch (error) {
        Sentry.captureMessage('Error while fetching list of boards: ' + ids)
        throw error
    }
}

export async function getAllBoardsForUser() {
    const user = await getUserWithBoardIds()
    if (!user) return redirect('/')

    const privateBoardIDs = user.owner ?? []
    const privateBoards = (await getBoards(privateBoardIDs)).map((board) => ({
        board,
    }))

    const organizations = await getOrganizationsForUser()

    const organizationsBoards = flattenDeep(
        await Promise.all(
            organizations.map(async (organization) =>
                (await getBoards(organization.boards)).map((board) => ({
                    board,
                    organization,
                })),
            ),
        ),
    )
    return [...organizationsBoards, ...privateBoards]
}
