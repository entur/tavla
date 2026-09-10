'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getBoard, updateBoard } from 'src/firebase'
import type {
    BoardDB,
    BoardTileDB,
    LocationDB,
    TransportPalette,
} from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'
import {
    closestStopPlacesToTiles,
    getDrivingDistance,
    getStopPlaceCoordinates,
    getWalkingDistance,
} from './utils'
import { parseClosestStopPlaces } from './validation'

initializeAdminApp()

export type AddStopPlaceFormState =
    | { status: 'success' }
    | {
          status: 'error'
          message: string
          field?: 'stop_place' | 'closest_stop_places'
      }
    | null

async function addTiles(bid: BoardDB['id'], tiles: BoardTileDB[]) {
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

    try {
        const [walkingResult, drivingResult] = await Promise.allSettled([
            getWalkingDistance(fromCoordinates, toCoordinates),
            getDrivingDistance(fromCoordinates, toCoordinates),
        ])

        const walkingDistance =
            walkingResult.status === 'fulfilled'
                ? walkingResult.value
                : undefined
        const drivingDistance =
            drivingResult.status === 'fulfilled'
                ? drivingResult.value
                : undefined

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
    } catch (error) {
        logToGcp(
            'error',
            `Failed to add walking distance to tile: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureMessage('Failed to add walking distance to tile')
        throw error
    }
}

export async function addStopPlaceTiles(
    bid: BoardDB['id'],
    data: FormData,
    isArrivals: boolean | undefined,
    location: LocationDB | undefined,
): Promise<AddStopPlaceFormState> {
    logToGcp('info', 'action:addStopPlaceTiles invoked')
    const parsedStopPlaces = parseClosestStopPlaces(data)

    if (!parsedStopPlaces.success) {
        logToGcp(
            'error',
            `Failed to parse closest stop places: ${parsedStopPlaces.error.issues[0]?.message ?? 'Ugyldig data'}`,
            { bid },
        )
        return {
            status: 'error',
            message:
                parsedStopPlaces.error.issues[0]?.message ?? 'Ugyldig data',
            field: 'closest_stop_places',
        }
    }

    const tiles = closestStopPlacesToTiles(parsedStopPlaces.data, isArrivals)

    try {
        const tilesWithDistance = await Promise.all(
            tiles
                .filter((tile) => tile.stopPlaceId)
                .map((tile) => getTileWithWalkingDistance(tile, location)),
        )
        await addTiles(bid, tilesWithDistance)
    } catch {
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)
    return { status: 'success' }
}
