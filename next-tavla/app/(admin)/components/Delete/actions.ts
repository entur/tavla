'use server'

import { TavlaError } from 'Admin/types/error'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { firestore } from 'firebase-admin'
import { chunk, isEmpty } from 'lodash'
import { redirect } from 'next/navigation'
import {
    TBoard,
    TBoardID,
    TOrganization,
    TOrganizationID,
    TUserID,
} from 'types/settings'

const FIREBASE_IN_OPERATOR_LIMIT = 30

initializeAdminApp()

export async function deleteOrganizationBoard(
    oid: TOrganizationID,
    bid: TBoardID,
    uid: TUserID,
) {
    const access = await userCanEditOrganization(uid, oid)
    if (!access) {
        throw new TavlaError({
            code: 'ORGANIZATION',
            message: 'User does not have access to this organization.',
        })
    }
    return firestore().collection('boards').doc(bid).delete()
}

export async function getBoardsForOrganization(oid: TOrganizationID) {
    const boardIDs = (
        await firestore().collection('organizations').doc(oid).get()
    ).data()?.boards

    if (isEmpty(boardIDs)) return []

    const batchedBoardIDs = chunk(boardIDs, FIREBASE_IN_OPERATOR_LIMIT)

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

export async function deleteOrganization(oid: TOrganizationID, uid: TUserID) {
    const access = await userCanEditOrganization(uid, oid)
    if (!access) {
        throw new TavlaError({
            code: 'ORGANIZATION',
            message: 'User does not have access to this organization.',
        })
    }
    await deleteOrganizationBoards(oid, uid)
    await firestore().collection('organizations').doc(oid).delete()

    redirect('/organizations')
}

export async function deleteOrganizationBoards(
    oid: TOrganizationID,
    uid: TUserID,
) {
    const boards = await getBoardsForOrganization(oid)

    return Promise.all(
        boards
            .filter((board) => board !== undefined)
            .map(
                (board) =>
                    board?.id && deleteOrganizationBoard(oid, board.id, uid),
            ),
    )
}

export async function getOrganizationById(oid: TOrganizationID) {
    const organization = (
        await firestore().collection('organizations').doc(oid).get()
    ).data()
    if (!organization) return undefined
    return { id: oid, ...organization } as TOrganization
}

export async function userCanEditOrganization(uid: TUserID, oid: string) {
    const organization = await getOrganizationById(oid)
    return organization?.owners?.includes(uid) ?? false
}
