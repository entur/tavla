'use server'
import { getUser, initializeAdminApp } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TBoard, TBoardID } from 'types/settings'
import { TTile } from 'types/tile'

initializeAdminApp()

export async function getBoard(bid: TBoardID) {
    const board = await firestore().collection('boards').doc(bid).get()
    return { id: board.id, ...board.data() } as TBoard
}

export async function addTile(bid: TBoardID, tile: TTile) {
    const user = await getUser()
    if (!user || (!user.owner?.includes(bid) && !user.editor?.includes(bid)))
        return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            tiles: firestore.FieldValue.arrayUnion(tile),
            'meta.dateModified': Date.now(),
        })
}
