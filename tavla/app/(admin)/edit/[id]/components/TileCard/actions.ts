'use server'
import { firestore } from 'firebase-admin'
import { TBoard, TBoardID, TOrganization } from 'types/settings'
import { TTile } from 'types/tile'
import { revalidatePath } from 'next/cache'
import {
    hasBoardEditorAccess,
    hasBoardOwnerAccess,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'

initializeAdminApp()

export async function deleteTile(bid: TBoardID, tile: TTile) {
    const access = await hasBoardOwnerAccess(bid)
    if (!access) return redirect('/')

    try {
        const boardRef = firestore().collection('boards').doc(bid)
        const board = (await boardRef.get()).data() as TBoard
        const tileToDelete = board.tiles.find((t) => t.uuid === tile.uuid)

        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                tiles: firestore.FieldValue.arrayRemove(tileToDelete),
                'meta.dateModified': Date.now(),
            })
        revalidatePath(`/edit/${bid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while deleting tile from board',
                boardID: bid,
                tileObject: tile,
            },
        })
    }
}

export async function saveTile(bid: TBoardID, tile: TTile) {
    const access = await hasBoardEditorAccess(bid)
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

        if (tile.displayName) {
            board.tiles[indexExistingTile] = {
                ...tile,
                displayName: tile.displayName.substring(0, 50),
            }
        } else {
            board.tiles[indexExistingTile] = tile
        }

        boardRef.update({ tiles: board.tiles, 'meta.dateModified': Date.now() })

        revalidatePath(`/edit/${bid}`)
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

export async function getOrganizationForBoard(bid: TBoardID) {
    try {
        const ref = await firestore()
            .collection('organizations')
            .where('boards', 'array-contains', bid)
            .get()

        return ref.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as TOrganization,
        )[0]
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching organization for board: ' + bid,
        )
        throw error
    }
}
