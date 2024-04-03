'use server'
import {
    hasBoardEditorAccess,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TBoard, TBoardID } from 'types/settings'
import { TTile } from 'types/tile'
import { getWalkingDistance } from 'app/(admin)/components/TileSelector/utils'
import { TLocation } from 'types/meta'
import { getFormFeedbackForError } from 'app/(admin)/utils'

initializeAdminApp()

export async function getBoard(bid: TBoardID) {
    const board = await firestore().collection('boards').doc(bid).get()
    return { id: board.id, ...board.data() } as TBoard
}

export async function addTile(board: TBoard, tile: TTile) {
    const access = await hasBoardEditorAccess(board.id)
    if (!access) return redirect('/')

    if (!board.id) return getFormFeedbackForError()
    await firestore()
        .collection('boards')
        .doc(board.id)
        .update({
            tiles: firestore.FieldValue.arrayUnion(
                await getWalkingDistanceTile(tile, board.meta.location),
            ),
            'meta.dateModified': Date.now(),
        })
}

export async function getWalkingDistanceTile(
    tile: TTile,
    location?: TLocation,
) {
    const walkingDistance = await getWalkingDistance(tile.placeId, location)
    if (!walkingDistance) {
        delete tile.walkingDistance
        return tile
    }
    return {
        ...tile,
        walkingDistance: {
            distance: Number(walkingDistance),
            visible: tile.walkingDistance?.visible ?? false,
        },
    }
}
