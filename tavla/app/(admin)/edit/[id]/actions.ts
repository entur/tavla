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
import { revalidatePath } from 'next/cache'
import { makeBoardCompatible } from './compatibility'

initializeAdminApp()

export async function getBoard(bid: TBoardID) {
    const board = await firestore().collection('boards').doc(bid).get()
    return makeBoardCompatible({ id: board.id, ...board.data() } as TBoard)
}

export async function addTile(bid: TBoardID, tile: TTile) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            tiles: firestore.FieldValue.arrayUnion(tile),
            'meta.dateModified': Date.now(),
        })
}

export async function getWalkingDistanceTile(
    tile: TTile,
    location?: TLocation,
) {
    const walkingDistance = await getWalkingDistance(tile.placeId, location)
    if (!walkingDistance && !location) {
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
export async function saveTiles(bid: TBoardID, tiles: TTile[]) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore().collection('boards').doc(bid).update({
        tiles: tiles,
        'meta.dateModified': Date.now(),
    })
    revalidatePath(`/edit/${bid}`)
}
