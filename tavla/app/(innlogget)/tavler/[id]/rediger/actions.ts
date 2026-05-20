'use server'
import * as Sentry from '@sentry/nextjs'
import {
    getStopPlaceCoordinates,
    getWalkingDistance,
} from 'app/(innlogget)/components/TileSelector/utils'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type {
    BoardDB,
    BoardTileDB,
    LocationDB,
    TransportPalette,
} from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

const db = getFirestore()

export async function addTiles(bid: BoardDB['id'], tiles: BoardTileDB[]) {
    await logToGcp('info', 'action:addTiles invoked', { bid })
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        const boardDoc = await db.collection('boards').doc(bid).get()
        const currentBoard = boardDoc.data() as BoardDB | undefined

        const updateData: {
            tiles: FieldValue
            'meta.dateModified': number
            isCombinedTiles: boolean
            transportPalette?: TransportPalette
        } = {
            tiles: FieldValue.arrayUnion(...tiles),
            'meta.dateModified': Date.now(),
            isCombinedTiles: currentBoard?.isCombinedTiles || false,
        }

        if (!currentBoard?.tiles || currentBoard.tiles.length === 0) {
            updateData.transportPalette = 'default'
        }

        await db.collection('boards').doc(bid).update(updateData)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to save tile to board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureMessage(
            'Failed to save tile to board in firestore. BoardID: ' + bid,
        )
        throw error
    }
}

export async function getWalkingDistanceTile(
    tile: BoardTileDB,
    location: LocationDB,
): Promise<BoardTileDB> {
    await logToGcp('info', 'action:getWalkingDistanceTile invoked')
    const fromCoordinates = await getStopPlaceCoordinates(tile.stopPlaceId)
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
    await logToGcp('info', 'action:saveUpdatedTileOrder invoked', { bid })
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        await db.collection('boards').doc(bid).update({
            tiles: tiles,
            'meta.dateModified': Date.now(),
        })
        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to save tile order for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
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

export async function saveCustomUrl(
    bid: BoardDB['id'],
    customUrl: string,
): Promise<{ error?: string }> {
    await logToGcp('info', 'action:saveCustomUrl invoked', { bid })
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    const trimmed = customUrl.trim()

    if (trimmed && !/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        return {
            error: 'Du kan kun bruke bokstaver (ikke æ, ø og å), tall, bindestrek og understrek.',
        }
    }

    if (trimmed && /^preview/i.test(trimmed)) {
        return {
            error: 'Denne lenken kan ikke brukes.',
        }
    }

    try {
        if (trimmed) {
            const existing = await db
                .collection('boards')
                .where('customUrl', '==', trimmed)
                .get()

            const taken = existing.docs.some((doc) => doc.id !== bid)
            if (taken) {
                return { error: 'Denne lenken er allerede i bruk.' }
            }
        }

        await db
            .collection('boards')
            .doc(bid)
            .update({
                customUrl: trimmed || FieldValue.delete(),
                'meta.dateModified': Date.now(),
            })

        revalidatePath(`/tavler/${bid}/rediger`)
        return {}
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to save custom URL for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving custom board URL',
                boardID: bid,
            },
        })
        return { error: 'Noe gikk galt. Prøv igjen.' }
    }
}
