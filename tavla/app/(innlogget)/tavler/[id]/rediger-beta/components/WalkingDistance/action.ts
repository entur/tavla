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
    _prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action:saveWalkingDistance invoked', { bid })

    const raw = formData.get('newLocation')?.toString() ?? ''
    let location: LocationDB | undefined

    if (raw) {
        let json: unknown
        try {
            json = JSON.parse(raw)
        } catch {
            return { status: 'error', message: 'Ugyldig posisjon' }
        }

        const parsed = locationSchema.safeParse(json)
        if (!parsed.success)
            return { status: 'error', message: 'Ugyldig posisjon' }

        location = parsed.data
    }

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
