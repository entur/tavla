'use server'
import { firestore } from 'firebase-admin'
import {
    TOrganizationID,
    TOrganization,
    TBoard,
    TBoardID,
    TUserID,
} from 'types/settings'
import { getUserWithBoardIds, initializeAdminApp } from './utils/firebase'
import { getUserFromSessionCookie } from './utils/server'
import { chunk, isEmpty } from 'lodash'
import { redirect } from 'next/navigation'
import { FIREBASE_DEV_CONFIG, FIREBASE_PRD_CONFIG } from './utils/constants'
import * as Sentry from '@sentry/nextjs'

initializeAdminApp()

export async function getFirebaseClientConfig() {
    const env = process.env.GOOGLE_PROJECT_ID
    if (env === 'ent-tavla-prd') return FIREBASE_PRD_CONFIG
    return FIREBASE_DEV_CONFIG
}

function userInOrganization(uid?: TUserID, organization?: TOrganization) {
    return uid && organization && organization.owners?.includes(uid)
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

export async function getPrivateBoardsForUser() {
    const userWithBoards = await getUserWithBoardIds()
    const privateBoards = await getBoards(userWithBoards?.owner as TBoardID[])

    return privateBoards
}
