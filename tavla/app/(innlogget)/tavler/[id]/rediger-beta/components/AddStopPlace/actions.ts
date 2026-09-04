'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { D } from 'node_modules/vitest/dist/chunks/reporters.d.CtLUhkkA'
import { getBoard, updateBoard } from 'src/firebase'
import type {
    BoardDB,
    BoardTileDB,
    LocationDB,
    TransportPalette,
} from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'
import type { FormState } from '../EditTitle/actions'
import {
    formDataToTiles,
    getDrivingDistance,
    getStopPlaceCoordinates,
    getWalkingDistance,
} from './utils'

initializeAdminApp()

export async function addTiles(bid: BoardDB['id'], tiles: BoardTileDB[]) {
    logToGcp('info', 'action:addTiles invoked', { bid })
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
        logToGcp(
            'error',
            `Failed to save tile to board: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureMessage(
            'Failed to save tile to board in firestore. BoardID: ' + bid,
        )
        throw error
    }
}

export async function getTileWithWalkingDistance(
    tile: BoardTileDB,
    location: LocationDB | undefined,
): Promise<BoardTileDB> {
    if (!location) {
        delete tile.walkingDistance
        delete tile.drivingDistance
        return tile
    }
    logToGcp('info', 'action:getWalkingDistanceTile invoked')
    const fromCoordinates = await getStopPlaceCoordinates(tile.stopPlaceId)
    const toCoordinates = location.coordinate

    const [walkingResult, drivingResult] = await Promise.allSettled([
        getWalkingDistance(fromCoordinates, toCoordinates),
        getDrivingDistance(fromCoordinates, toCoordinates),
    ])

    const walkingDistance =
        walkingResult.status === 'fulfilled' ? walkingResult.value : undefined
    const drivingDistance =
        drivingResult.status === 'fulfilled' ? drivingResult.value : undefined

    const newTile = { ...tile }

    if (walkingDistance !== undefined) {
        newTile.walkingDistance = { distance: walkingDistance }
    } else {
        delete newTile.walkingDistance
    }

    if (drivingDistance !== undefined) {
        newTile.drivingDistance = { distance: drivingDistance }
    } else {
        delete newTile.drivingDistance
    }

    return newTile
}

//tilsvarer addTilesAction() fra page i rediger/page.tsx
export async function addStopPlaceTiles(
    bid: BoardDB['id'],
    data: FormData,
    isArrivals: boolean | undefined,
    location: LocationDB | undefined,
): Promise<FormState> {
    const tiles = formDataToTiles(data, isArrivals)
    //TODO: bruke zod for trygg parsing

    //TODO: bedre feilmelding
    if (tiles.length === 0) return { status: 'error', message: 'ingen tiles' }

    try {
        const tilesWithDistance = await Promise.all(
            tiles
                .filter((tile) => tile.stopPlaceId)
                .map((tile) => getTileWithWalkingDistance(tile, location)),
        )
        await addTiles(bid, tilesWithDistance)
    } catch (error) {
        logToGcp(
            'error',
            `Failed to add stop place tiles: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)
    return { status: 'success' }
}
