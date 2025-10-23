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
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
    BoardDB,
    BoardIdDB,
    BoardTileDB,
    CoordinateDB,
    LocationDB,
} from 'types/db-types/boards'

initializeAdminApp()

export async function addTile(bid: BoardIdDB, tile: BoardTileDB) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                tiles: firestore.FieldValue.arrayUnion(tile),
                'meta.dateModified': Date.now(),
            })
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
        await firestore()
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
    location?: LocationDB,
) {
    const fromCoordinates = await (() => {
        if (tile.type === 'quay') {
            return getQuayCoordinates(tile.placeId)
        } else {
            return getStopPlaceCoordinates(tile.placeId)
        }
    })()
    const toCoordinates: CoordinateDB = {
        lat: 0,
        lng: 0,
        ...(location?.coordinate || {}),
    }
    const walkingDistance = await getWalkingDistance(
        fromCoordinates,
        toCoordinates,
    )

    if (!walkingDistance && !location) {
        delete tile.walkingDistance
        return tile
    }
    return {
        ...tile,
        walkingDistance: {
            distance: Number(walkingDistance),
        },
    }
}
export async function saveUpdatedTileOrder(
    bid: BoardIdDB,
    tiles: BoardTileDB[],
) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        await firestore().collection('boards').doc(bid).update({
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
