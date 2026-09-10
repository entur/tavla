'use server'
import * as Sentry from '@sentry/nextjs'
import { getTileWithWalkingDistance } from 'app/(innlogget)/tavler/[id]/rediger/actions'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getBoard, updateBoard } from 'src/firebase'
import type { LocationDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'
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

export async function saveWalkingDistance(
    bid: string,
    value?: LocationDB,
): Promise<FormState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action:saveWalkingDistance invoked', { bid })

    const parsed = value ? locationSchema.safeParse(value) : undefined

    if (parsed && !parsed.success) {
        logToGcp(
            'error',
            `Invalid location payload for saveWalkingDistance: ${parsed.error.message}`,
            { bid },
        )
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
        logToGcp(
            'error',
            `Failed to save walking distance: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)
    return { status: 'success' }
}
