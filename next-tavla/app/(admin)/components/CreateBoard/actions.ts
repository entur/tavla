'use server'

import { initializeAdminApp } from 'Admin/utils/firebase'
import admin, { firestore } from 'firebase-admin'
import { TBoard, TOrganizationID, TUserID } from 'types/settings'

initializeAdminApp()

export async function createBoard(
    id: TUserID | TOrganizationID,
    board: TBoard,
    collection: 'users' | 'organizations',
) {
    const createdBoard = await firestore()
        .collection('boards')
        .add({
            ...board,
            meta: {
                ...board.meta,
                created: Date.now(),
                dateModified: Date.now(),
            },
        })
    firestore()
        .collection(collection)
        .doc(id)
        .update({
            [collection === 'users' ? 'owner' : 'boards']:
                admin.firestore.FieldValue.arrayUnion(createdBoard.id),
        })
    return createdBoard.id
}
