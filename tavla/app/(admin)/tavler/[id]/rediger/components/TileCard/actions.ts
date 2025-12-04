'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(admin)/utils/firebase'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { isEmpty } from 'lodash'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { BoardDB, BoardTileDB } from 'types/db-types/boards'
import { COUNTY_THEME_MAP } from '../Settings/colorPalettes'

initializeAdminApp()

const db = getFirestore()

export async function deleteTile(boardId: string, tile: BoardTileDB) {
    const access = await userCanEditBoard(boardId)
    if (!access) return redirect('/')

    try {
        const board = await getBoard(boardId)
        const tileToDelete = board?.tiles.find((t) => t.uuid === tile.uuid)

        const updatedCombinedTiles = board?.combinedTiles?.map((t) => {
            return {
                ids: t.ids.filter((id) => id !== tile.uuid),
            }
        })

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
            combinedTiles: isEmpty(updatedCombinedTiles)
                ? FieldValue.delete()
                : updatedCombinedTiles,
            tiles: FieldValue.arrayRemove(tileToDelete),
            'meta.dateModified': Date.now(),
        }

        if (shouldResetPalette) {
            updatePayload.transportPalette = 'default'
        }

        await db.collection('boards').doc(boardId).update(updatePayload)
        revalidatePath(`/tavler/${boardId}/rediger`)
    } catch (error) {
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
        const boardRef = db.collection('boards').doc(bid)
        const board = await getBoard(bid)
        const existingTile = board?.tiles.find((t) => t.uuid === tile.uuid)
        if (!existingTile)
            return boardRef.update({
                tiles: FieldValue.arrayUnion(tile),
                'meta.dateModified': Date.now(),
            })
        const indexExistingTile = board?.tiles.indexOf(existingTile)

        if (
            board &&
            indexExistingTile !== undefined &&
            indexExistingTile !== -1
        ) {
            board.tiles[indexExistingTile] = tile
            boardRef.update({
                tiles: board.tiles,
                'meta.dateModified': Date.now(),
            })
        }

        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving tile',
                boardID: bid,
                tileObject: tile,
            },
        })
    }
}
