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
import type { BoardTileDB, LocationDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'
import {
    getDrivingDistance,
    getStopPlaceCoordinates,
    getWalkingDistance,
} from '../AddStopPlace/utils'
import { locationSchema } from './validation'

initializeAdminApp()

export type FormState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

function isSameLocation(a: LocationDB | undefined, b: LocationDB | undefined) {
    if (!a && !b) return true
    if (!a || !b) return false
    return (
        a.coordinate?.lat === b.coordinate?.lat &&
        a.coordinate?.lng === b.coordinate?.lng
    )
}

async function getTileWithWalkingDistance(
    tile: BoardTileDB,
    location: LocationDB | undefined,
): Promise<BoardTileDB> {
    if (!location) {
        delete tile.walkingDistance
        delete tile.drivingDistance
        return tile
    }
    logToGcp('info', 'action invoked: getWalkingDistanceTile', {
        type: 'server-action',
        action: 'getWalkingDistanceTile',
    })
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
        logToGcp('error', 'action failed: getWalkingDistanceTile', {
            type: 'server-action',
            action: 'getWalkingDistanceTile',
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
        Sentry.captureMessage('Failed to add walking distance to tile')
        throw error
    }
}

export async function saveWalkingDistance(
    bid: string,
    value?: LocationDB,
): Promise<FormState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action invoked: saveWalkingDistance', {
        type: 'server-action',
        action: 'saveWalkingDistance',
        bid,
    })

    const parsed = value ? locationSchema.safeParse(value) : undefined

    if (parsed && !parsed.success) {
        logToGcp('error', 'invalid location payload', {
            type: 'server-action',
            action: 'saveWalkingDistance',
            bid,
            errorMessage: parsed.error.message,
        })
        return { status: 'error', message: 'Ugyldig posisjon' }
    }

    const location = parsed?.data

    try {
        const board = await getBoard(bid)
        if (!board) return { status: 'error', message: 'Fant ikke tavla' }

        if (!isSameLocation(location, board.meta.location)) {
            const tiles = await Promise.all(
                board.tiles.map((tile) =>
                    getTileWithWalkingDistance(tile, location),
                ),
            )

            await updateBoard(bid, {
                'meta.location': location ?? FieldValue.delete(),
                tiles,
            })
        }
    } catch (error) {
        logToGcp('error', 'action failed: saveWalkingDistance', {
            type: 'server-action',
            action: 'saveWalkingDistance',
            bid,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger`)
    revalidatePath(`/lag-tavle/${bid}`)
    return { status: 'success' }
}
