'use server'
import * as Sentry from '@sentry/nextjs'
import {
    getStopPlaceCoordinates,
    getWalkingDistance,
} from 'app/_components/TileSelector/utils'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getBoard, getBoardByCustomUrl, updateBoard } from 'src/firebase'
import type {
    BoardDB,
    BoardTileDB,
    LocationDB,
    TransportPalette,
} from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function addTiles(bid: BoardDB['id'], tiles: BoardTileDB[]) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        const currentBoard = await getBoard(bid)

        const updateData: {
            tiles: FieldValue
            isCombinedTiles: boolean
            transportPalette?: TransportPalette
        } = {
            tiles: FieldValue.arrayUnion(...tiles),
            isCombinedTiles: currentBoard?.isCombinedTiles || false,
        }

        if (!currentBoard?.tiles || currentBoard.tiles.length === 0) {
            updateData.transportPalette = 'default'
        }

        await updateBoard(bid, updateData)
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
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        await updateBoard(bid, { tiles })
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
            const existing = await getBoardByCustomUrl(trimmed)
            if (existing && existing.id !== bid) {
                return { error: 'Denne lenken er allerede i bruk.' }
            }
        }

        await updateBoard(bid, {
            customUrl: trimmed || FieldValue.delete(),
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
