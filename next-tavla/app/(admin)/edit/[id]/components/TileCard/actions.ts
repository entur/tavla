'use server'
import { firestore } from 'firebase-admin'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { TBoardID } from 'types/settings'
import { TTile } from 'types/tile'
import { revalidatePath } from 'next/cache'

initializeAdminApp()

export async function deleteTile(bid: TBoardID, tile: TTile) {
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ tiles: firestore.FieldValue.arrayRemove(tile) })
    revalidatePath(`/edit/${bid}`)
}
