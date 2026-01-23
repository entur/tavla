'use server'
import * as Sentry from '@sentry/nextjs'
import {
    getQuayCoordinates,
    getStopPlaceCoordinates,
    getWalkingDistance,
} from 'app/(admin)/components/TileSelector/utils'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(admin)/utils/firebase'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
    BoardDB,
    BoardTileDB,
    LocationDB,
    TransportPalette,
} from 'src/types/db-types/boards'

initializeAdminApp()

const db = getFirestore()

export async function addTile(bid: BoardDB['id'], tile: BoardTileDB) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        const boardDoc = await db.collection('boards').doc(bid).get()
        const currentBoard = boardDoc.data() as BoardDB | undefined

        const updateData: {
            tiles: FieldValue
            'meta.dateModified': number
            transportPalette?: TransportPalette
        } = {
            tiles: FieldValue.arrayUnion(tile),
            'meta.dateModified': Date.now(),
        }

        if (!currentBoard?.tiles || currentBoard.tiles.length === 0) {
            updateData.transportPalette = 'default'
        }

        await db.collection('boards').doc(bid).update(updateData)
    } catch (error) {
        Sentry.captureMessage(
            'Failed to save tile to board in firestore. BoardID: ' + bid,
        )
        throw error
    }
}

export async function addTileToCombinedList(board: BoardDB, tileId: string) {
    const access = await userCanEditBoard(board.id)
    if (!access) return redirect('/')

    try {
        const updatedCombinedTiles = board.combinedTiles?.map((tile) => {
            return { ids: [...tile.ids, tileId] }
        })
        await db
            .collection('boards')
            .doc(board.id ?? '')
            .update({
                combinedTiles: updatedCombinedTiles,
                'meta.dateModified': Date.now(),
            })
    } catch (error) {
        Sentry.captureMessage(
            'Failed to save tile to board in firestore. BoardID: ' + board.id,
        )
        throw error
    }
}

export async function getWalkingDistanceTile(
    tile: BoardTileDB,
    location: LocationDB,
): Promise<BoardTileDB> {
    const fromCoordinates = await (() => {
        if (tile.type === 'quay') {
            return getQuayCoordinates(tile.placeId)
        } else {
            return getStopPlaceCoordinates(tile.placeId)
        }
    })()
    const toCoordinates = location.coordinate

    const walkingDistance = await getWalkingDistance(
        fromCoordinates,
        toCoordinates,
    )

    if (!walkingDistance) {
        delete tile.walkingDistance
        return tile
    }

    return {
        ...tile,
        walkingDistance: {
            distance: walkingDistance,
        },
    }
}
export async function saveUpdatedTileOrder(
    bid: BoardDB['id'],
    tiles: BoardTileDB[],
) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        await db.collection('boards').doc(bid).update({
            tiles: tiles,
            'meta.dateModified': Date.now(),
        })
        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while saving updated tile ordering to firestore',
                boardID: bid,
                tilesObjects: tiles,
            },
        })
    }
}
