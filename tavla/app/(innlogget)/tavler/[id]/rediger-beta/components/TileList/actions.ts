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

export async function deleteTile(boardId: string, tile: BoardTileDB) {
    logToGcp('info', 'action:deleteTile invoked', { bid: boardId })
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
        logToGcp(
            'error',
            `Failed to delete tile from board: ${error instanceof Error ? error.message : String(error)}`,
            { bid: boardId },
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while deleting tile from board',
                boardID: boardId,
                tileObject: tile,
            },
        })
    }
}
