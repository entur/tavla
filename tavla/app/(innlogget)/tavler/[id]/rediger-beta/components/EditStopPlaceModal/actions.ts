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
import {
    type BoardDB,
    type BoardTileDB,
    boardTileSchema,
} from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'
import { displayNameSchema, offsetSchema } from './validation'

initializeAdminApp()

export type EditStopPlaceModalFormState =
    | { status: 'success' }
    | {
          status: 'error'
          message: string
          field?: 'lines' | 'offset'
      }
    | null

export async function saveTile(
    bid: BoardDB['id'],
    tile: BoardTileDB,
): Promise<EditStopPlaceModalFormState> {
    logToGcp('info', 'action:saveTile invoked', { bid })
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    const parsed = boardTileSchema.safeParse(tile)
    const offsetParsed = offsetSchema.safeParse(tile.offset)
    const displayNameParsed = displayNameSchema.safeParse(tile.displayName)

    try {
        if (!parsed.success) {
            throw new Error('Failed to parse tile')
        }
        if (!offsetParsed.success) {
            throw new Error('Failed to parse offset')
        }
        if (!displayNameParsed.success) {
            throw new Error('Failed to parse display name')
        }

        const board = await getBoard(bid)
        const existingTile = board?.tiles.find((t) => t.uuid === tile.uuid)
        if (!existingTile) {
            await updateBoard(bid, { tiles: FieldValue.arrayUnion(tile) })
            revalidatePath(`/tavler/${bid}/rediger-beta`)
            return { status: 'success' }
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
        return { status: 'success' }
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
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }
}
