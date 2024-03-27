'use server'
import { firestore } from 'firebase-admin'
import { TOrganizationID, TOrganization, TBoard, TUser } from 'types/settings'
import { initializeAdminApp } from './utils/firebase'
import { getUserFromSessionCookie } from './utils/server'
import { chunk, concat, isEmpty } from 'lodash'
import { TavlaError } from './utils/types'

initializeAdminApp()

export async function getOrganization(oid?: TOrganizationID) {
    if (!oid) return undefined
    const doc = await firestore().collection('organizations').doc(oid).get()
    return { ...doc.data(), id: doc.id } as TOrganization
}

export async function getOrganizationsForUser() {
    const user = await getUserFromSessionCookie()
    if (!user) return []

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
    const boardIDs = (
        await firestore().collection('organizations').doc(oid).get()
    ).data()?.boards

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

export async function getBoardsForUser() {
    const user = await getUserFromSessionCookie()
    if (!user) return []
    const userObj = (
        await firestore().collection('users').doc(user.uid).get()
    ).data() as TUser

    if (!userObj)
        throw new TavlaError({
            code: 'NOT_FOUND',
            message: `Found no user with id ${user.uid}`,
        })
    const boardIDs = concat(userObj?.owner ?? [], userObj?.editor ?? [])

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
