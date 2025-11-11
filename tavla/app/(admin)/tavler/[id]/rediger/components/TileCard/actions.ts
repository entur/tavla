'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { isEmpty } from 'lodash'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { BoardDB, BoardDBSchema, BoardTileDB } from 'types/db-types/boards'
import { FolderDB, FolderDBSchema } from 'types/db-types/folders'
import { COUNTY_THEME_MAP } from '../Settings/colorPalettes'

initializeAdminApp()

export async function deleteTile(boardId: string, tile: BoardTileDB) {
    const access = await userCanEditBoard(boardId)
    if (!access) return redirect('/')

    try {
        const boardRef = firestore().collection('boards').doc(boardId)
        const board = BoardDBSchema.parse((await boardRef.get()).data())
        const tileToDelete = board.tiles.find((t) => t.uuid === tile.uuid)

        const updatedCombinedTiles = board.combinedTiles?.map((t) => {
            return {
                ids: t.ids.filter((id) => id !== tile.uuid),
            }
        })

        const remainingTiles = board.tiles.filter((t) => t.uuid !== tile.uuid)
        const remainingCounties = new Set<string>()

        remainingTiles.forEach((t) => {
            if (t.county) {
                remainingCounties.add(t.county)
            }
        })

        const hasCountyThemes = Array.from(remainingCounties).some(
            (county) =>
                COUNTY_THEME_MAP[county as keyof typeof COUNTY_THEME_MAP],
        )

        const currentPalette = board.transportPalette
        const countyThemeValues = Object.values(COUNTY_THEME_MAP)
        const shouldResetPalette =
            !hasCountyThemes &&
            currentPalette &&
            countyThemeValues.includes(
                currentPalette as (typeof countyThemeValues)[number],
            )

        const updatePayload: Record<string, unknown> = {
            combinedTiles: isEmpty(updatedCombinedTiles)
                ? firestore.FieldValue.delete()
                : updatedCombinedTiles,
            tiles: firestore.FieldValue.arrayRemove(tileToDelete),
            'meta.dateModified': Date.now(),
        }

        if (shouldResetPalette) {
            updatePayload.transportPalette = 'default'
        }

        await firestore()
            .collection('boards')
            .doc(boardId)
            .update(updatePayload)
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
        const boardRef = firestore().collection('boards').doc(bid)
        const board = BoardDBSchema.parse((await boardRef.get()).data())
        const existingTile = board.tiles.find((t) => t.uuid === tile.uuid)
        if (!existingTile)
            return boardRef.update({
                tiles: firestore.FieldValue.arrayUnion(tile),
                'meta.dateModified': Date.now(),
            })
        const indexExistingTile = board.tiles.indexOf(existingTile)

        board.tiles[indexExistingTile] = tile
        boardRef.update({ tiles: board.tiles, 'meta.dateModified': Date.now() })

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

export async function getFolderForBoard(bid: BoardDB['id']) {
    try {
        const ref = await firestore()
            .collection('folders')
            .where('boards', 'array-contains', bid)
            .get()

        // Sjekk om vi faktisk fant noen folders
        if (ref.docs.length === 0) {
            return null // Returnerer null hvis ingen folder funnet
        }

        const folderData = ref.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))[0]
        const parsedFolder = FolderDBSchema.safeParse(folderData)

        if (!parsedFolder.success) {
            Sentry.captureMessage(
                'Folder data validation failed in getFolderForBoard',
                {
                    level: 'warning',
                    extra: {
                        error: parsedFolder.error.flatten(),
                        boardId: bid,
                        folderId: folderData?.id,
                    },
                },
            )
            return folderData as FolderDB
        }

        return parsedFolder.data
    } catch (error) {
        Sentry.captureMessage('Error while fetching folder for board: ' + bid)
        throw error
    }
}
