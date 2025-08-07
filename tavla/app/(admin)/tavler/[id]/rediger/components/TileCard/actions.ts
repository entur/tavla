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
import { Dispatch, SetStateAction } from 'react'
import { TBoard, TBoardID, TFolder } from 'types/settings'
import { TTile } from 'types/tile'

initializeAdminApp()

export async function deleteTile(
    boardId: string,
    tile: TTile,
    addToast: (toast: string) => void,
    demoBoard?: TBoard,
    setDemoBoard?: Dispatch<SetStateAction<TBoard>>,
) {
    if (boardId === 'demo') {
        if (!demoBoard) return null
        const remainingTiles = demoBoard.tiles.filter(
            (t) => t.uuid !== tile.uuid,
        )
        if (setDemoBoard) setDemoBoard({ ...demoBoard, tiles: remainingTiles })
    } else {
        const access = await userCanEditBoard(boardId)
        if (!access) return redirect('/')

        try {
            const boardRef = firestore().collection('boards').doc(boardId)
            const board = (await boardRef.get()).data() as TBoard
            const tileToDelete = board.tiles.find((t) => t.uuid === tile.uuid)

            const updatedCombinedTiles = board.combinedTiles?.map((t) => {
                return {
                    ids: t.ids.filter((id) => id !== tile.uuid),
                }
            })

            await firestore()
                .collection('boards')
                .doc(boardId)
                .update({
                    combinedTiles: isEmpty(updatedCombinedTiles)
                        ? firestore.FieldValue.delete()
                        : updatedCombinedTiles,
                    tiles: firestore.FieldValue.arrayRemove(tileToDelete),
                    'meta.dateModified': Date.now(),
                })
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
    addToast(`${tile.name} fjernet!`)
}

export async function saveTile(bid: TBoardID, tile: TTile) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    try {
        const boardRef = firestore().collection('boards').doc(bid)
        const board = (await boardRef.get()).data() as TBoard
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

export async function getFolderForBoard(bid: TBoardID) {
    try {
        const ref = await firestore()
            .collection('folders')
            .where('boards', 'array-contains', bid)
            .get()

        return ref.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as TFolder,
        )[0]
    } catch (error) {
        Sentry.captureMessage('Error while fetching folder for board: ' + bid)
        throw error
    }
}
