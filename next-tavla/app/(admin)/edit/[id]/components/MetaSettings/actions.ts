'use server'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { TFontSize, TLocation } from 'types/meta'
import { TBoard, TBoardID } from 'types/settings'
import { getWalkingDistanceTile } from '../../actions'

initializeAdminApp()

export async function saveTitle(data: FormData) {
    const bid = data.get('bid') as TBoardID
    const name = data.get('name') as string
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.title': name, 'meta.dateModified': Date.now() })
    revalidatePath(`/edit/${bid}`)
}

export async function saveFont(data: FormData) {
    const bid = data.get('bid') as TBoardID
    const font = data.get('font') as TFontSize
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.fontSize': font, 'meta.dateModified': Date.now() })
    revalidatePath(`/edit/${bid}`)
}

export async function saveLocation(bid: TBoardID, location?: TLocation) {
    if (!bid) return getFormFeedbackForError()
    const boardRef = firestore().collection('boards').doc(bid)
    const board = (await boardRef.get()).data() as TBoard
    if (!board) return getFormFeedbackForError('board/not-found')
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            tiles: await getUpdatedTiles(board, location),
            'meta.location': location ?? firestore.FieldValue.delete(),
            'meta.dateModified': Date.now(),
        })
    revalidatePath(`/edit/${bid}`)
}

async function getUpdatedTiles(board: TBoard, location?: TLocation) {
    return await Promise.all(
        board.tiles.map(async (tile) => {
            return await getWalkingDistanceTile(tile, location)
        }),
    )
}
