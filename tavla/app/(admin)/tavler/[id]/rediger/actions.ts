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
import { TCoordinate, TLocation } from 'types/meta'
import { TBoard, TBoardID } from 'types/settings'
import { TTile } from 'types/tile'

initializeAdminApp()

export async function addTile(bid: TBoardID, tile: TTile) {
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

export async function addTileToCombinedList(board: TBoard, tileId: string) {
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
    tile: TTile,
    location?: TLocation,
) {
    const fromCoordinates = await (() => {
        if (tile.type === 'quay') {
            return getQuayCoordinates(tile.placeId)
        } else {
            return getStopPlaceCoordinates(tile.placeId)
        }
    })()
    const toCoordinates: TCoordinate = {
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
export async function saveUpdatedTileOrder(bid: TBoardID, tiles: TTile[]) {
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
