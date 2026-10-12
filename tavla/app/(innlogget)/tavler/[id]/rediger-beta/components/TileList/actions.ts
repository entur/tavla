'use server'
import * as Sentry from '@sentry/nextjs'
import { COUNTY_THEME_MAP } from 'app/_utils/colorPalettes'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getBoard, updateBoard } from 'src/firebase'
import type { BoardTileDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export type DeleteTileState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

export async function deleteTile(
    boardId: string,
    tile: BoardTileDB,
): Promise<DeleteTileState> {
    logToGcp('info', 'action invoked: deleteTile', {
        type: 'server-action',
        action: 'deleteTile',
        bid: boardId,
    })
    const access = await userCanEditBoard(boardId)
    if (!access) return redirect('/')

    try {
        const board = await getBoard(boardId)
        const tileToDelete = board?.tiles.find((t) => t.uuid === tile.uuid)
        const remainingTiles = board?.tiles.filter((t) => t.uuid !== tile.uuid)
        const remainingCounties = new Set<string>()

        remainingTiles?.forEach((t) => {
            if (t.county) {
                remainingCounties.add(t.county)
            }
        })

        const hasCountyThemes = Array.from(remainingCounties).some(
            (county) =>
                COUNTY_THEME_MAP[county as keyof typeof COUNTY_THEME_MAP],
        )

        const currentPalette = board?.transportPalette
        const countyThemeValues = Object.values(COUNTY_THEME_MAP)
        const shouldResetPalette =
            !hasCountyThemes &&
            currentPalette &&
            countyThemeValues.includes(
                currentPalette as (typeof countyThemeValues)[number],
            )

        const updatePayload: Record<string, unknown> = {
            tiles: FieldValue.arrayRemove(tileToDelete),
        }

        if (shouldResetPalette) {
            updatePayload.transportPalette = 'default'
        }

        await updateBoard(boardId, updatePayload)
        revalidatePath(`/tavler/${boardId}/rediger-beta`)
    } catch (error) {
        logToGcp('error', 'action failed: deleteTile', {
            type: 'server-action',
            action: 'deleteTile',
            bid: boardId,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
        Sentry.captureException(error, {
            extra: {
                message: 'Error while deleting tile from board',
                boardID: boardId,
                tileObject: tile,
            },
        })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    return { status: 'success' }
}

export async function saveUpdatedTileOrder(
    boardId: string,
    tiles: BoardTileDB[],
) {
    logToGcp('info', 'action invoked: saveUpdatedTileOrder', {
        type: 'server-action',
        action: 'saveUpdatedTileOrder',
        bid: boardId,
    })
    const access = await userCanEditBoard(boardId)
    if (!access) return redirect('/')

    try {
        await updateBoard(boardId, { tiles })
        revalidatePath(`/tavler/${boardId}/rediger-beta`)
    } catch (error) {
        logToGcp('error', 'action failed: saveUpdatedTileOrder', {
            type: 'server-action',
            action: 'saveUpdatedTileOrder',
            bid: boardId,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while saving updated tile ordering to firestore',
                boardID: boardId,
                tilesObjects: tiles,
            },
        })
        throw error
    }
}
