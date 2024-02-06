'use server'
import { firestore } from 'firebase-admin'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { TBoard, TBoardID } from 'types/settings'
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

export async function saveTile(bid: TBoardID, tile: TTile) {
    const docRef = firestore().collection('boards').doc(bid)
    const doc = (await docRef.get()).data() as TBoard
    const oldTile = doc.tiles.find((t) => t.uuid === tile.uuid)
    if (oldTile)
        docRef.update({ tiles: firestore.FieldValue.arrayRemove(oldTile) })
    docRef.update({ tiles: firestore.FieldValue.arrayUnion(tile) })
    revalidatePath(`/edit/${bid}`)
}

