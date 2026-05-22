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
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function deleteTile(boardId: string, tile: BoardTileDB) {
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
        revalidatePath(`/tavler/${boardId}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to delete tile from board ${boardId}: ${error instanceof Error ? error.message : String(error)}`,
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

export async function saveTile(bid: BoardDB['id'], tile: BoardTileDB) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        const board = await getBoard(bid)
        const existingTile = board?.tiles.find((t) => t.uuid === tile.uuid)
        if (!existingTile) {
            await updateBoard(bid, { tiles: FieldValue.arrayUnion(tile) })
            revalidatePath(`/tavler/${bid}/rediger`)
            return
        }
        const indexExistingTile = board?.tiles.indexOf(existingTile)

        if (
            board &&
            indexExistingTile !== undefined &&
            indexExistingTile !== -1
        ) {
            board.tiles[indexExistingTile] = tile
            await updateBoard(bid, { tiles: board.tiles })
        }

        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to save tile for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving tile',
                boardID: bid,
                tileObject: tile,
            },
        })
    }
}
