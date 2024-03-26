'use server'
import { getWalkingDistance } from 'app/(admin)/components/TileSelector/utils'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import {
    hasBoardEditorAccess,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TFontSize, TLocation } from 'types/meta'
import { TBoard, TBoardID } from 'types/settings'

initializeAdminApp()

export async function saveTitle(data: FormData) {
    const bid = data.get('bid') as TBoardID
    const name = data.get('name') as string

    const access = hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.title': name, 'meta.dateModified': Date.now() })
    revalidatePath(`/edit/${bid}`)
}

export async function saveFont(data: FormData) {
    const bid = data.get('bid') as TBoardID
    const font = data.get('font') as TFontSize

    const access = hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.fontSize': font, 'meta.dateModified': Date.now() })
    revalidatePath(`/edit/${bid}`)
}

export async function saveLocation(bid: TBoardID, location?: TLocation) {
    if (!bid) return getFormFeedbackForError()

    const access = hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    const boardRef = firestore().collection('boards').doc(bid)
    const board = (await boardRef.get()).data() as TBoard
    if (!board) return getFormFeedbackForError('board/not-found')
    const tiles = await getUpdatedTiles(board)
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            tiles: await getUpdatedTiles(board),
            'meta.location': location ?? firestore.FieldValue.delete(),
            'meta.dateModified': Date.now(),
        })
    revalidatePath(`/edit/${bid}`)
}

async function getUpdatedTiles(board: TBoard) {
    return await Promise.all(
        board.tiles.map(async (tile) => {
            return {
                ...tile,
                walkingDistance: {
                    distance: Number(
                        await getWalkingDistance(
                            tile.placeId,
                            board.meta.location,
                        ),
                    ),
                    visible: tile.walkingDistance?.visible,
                },
            }
        }),
    )
}
