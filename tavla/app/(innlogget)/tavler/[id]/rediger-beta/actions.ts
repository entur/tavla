'use server'
import * as Sentry from '@sentry/nextjs'
import { getWalkingDistanceTile } from 'app/(innlogget)/tavler/[id]/rediger/actions'
import {
    isEmptyOrSpaces,
    isOnlyWhiteSpace,
} from 'app/(innlogget)/tavler/[id]/utils'
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
    BoardFontSize,
    BoardTheme,
    LocationDB,
    TransportPalette,
} from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

/**
 * Revalidates the whole board layout so both the old (`/rediger`) and the new
 * (`/rediger-beta`) editor re-render with fresh data — this is what makes the
 * live preview iframe reload with an updated `v` timestamp.
 */
function revalidateBoard(bid: string) {
    revalidatePath(`/tavler/${bid}`, 'layout')
}

/**
 * Saves only the board identity (name + location). Unlike the legacy
 * `saveSettings`, this is a partial update and never touches appearance fields,
 * so the identity panel can be its own form independent of the appearance form.
 */
export async function saveIdentity(
    data: FormData,
): Promise<{ error?: string }> {
    const bid = data.get('bid') as BoardDB['id']
    const title = (data.get('title') as string) ?? ''
    const locationRaw = data.get('newLocation') as string

    logToGcp('info', 'action:saveIdentity invoked', { bid })

    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    if (isEmptyOrSpaces(title)) {
        return { error: 'Tavla må ha et navn.' }
    }

    const location: LocationDB | undefined = locationRaw
        ? (JSON.parse(locationRaw) as LocationDB)
        : undefined

    try {
        const board = await getBoard(bid)
        if (!board) return { error: 'Fant ikke tavla.' }

        const tiles = await Promise.all(
            board.tiles.map(async (tile) => {
                if (!location) {
                    delete tile.walkingDistance
                    return tile
                }
                return getWalkingDistanceTile(tile, location)
            }),
        )

        await updateBoard(bid, {
            'meta.title': title.substring(0, 50),
            'meta.location': location ?? FieldValue.delete(),
            tiles,
        })

        revalidateBoard(bid)
        return {}
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save board identity: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving board identity',
                boardID: bid,
            },
        })
        return { error: 'Noe gikk galt. Prøv igjen.' }
    }
}

/**
 * Saves only the appearance/display settings. Partial update — leaves name and
 * location untouched so it can live in a separate form from the identity panel.
 */
export async function saveAppearance(data: FormData): Promise<void> {
    const bid = data.get('bid') as BoardDB['id']
    const viewType = data.get('viewType') as string
    const theme = data.get('theme') as BoardTheme
    const font = data.get('font') as BoardFontSize
    const transportPalette = data.get('transportPalette') as TransportPalette
    const hideClock = data.get('clock') === null
    const hideLogo = data.get('logo') === null
    const infoMessage = data.get('infoMessage') as string

    logToGcp('info', 'action:saveAppearance invoked', { bid })

    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    const footerContainsText =
        infoMessage &&
        !isOnlyWhiteSpace(infoMessage) &&
        infoMessage.trim() !== ''

    try {
        await updateBoard(bid, {
            'meta.fontSize': font,
            theme: theme ?? 'dark',
            isCombinedTiles: viewType !== 'separate',
            footer: footerContainsText
                ? { footer: infoMessage }
                : FieldValue.delete(),
            transportPalette: transportPalette ?? 'default',
            hideClock,
            hideLogo,
        })

        revalidateBoard(bid)
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save appearance settings: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving appearance settings',
                boardID: bid,
            },
        })
    }
}
