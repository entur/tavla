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
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function saveTile(bid: BoardDB['id'], tile: BoardTileDB) {
    logToGcp('info', 'action:saveTile invoked', { bid })
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        const board = await getBoard(bid)
        const existingTile = board?.tiles.find((t) => t.uuid === tile.uuid)
        if (!existingTile) {
            await updateBoard(bid, { tiles: FieldValue.arrayUnion(tile) })
            revalidatePath(`/tavler/${bid}/rediger-beta`)
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

        revalidatePath(`/tavler/${bid}/rediger-beta`)
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save tile for board: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving tile',
                boardID: bid,
                tileObject: tile,
            },
        })
        throw error
    }
}
