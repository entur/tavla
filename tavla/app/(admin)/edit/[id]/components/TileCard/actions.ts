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
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                tiles: firestore.FieldValue.arrayRemove(tile),
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
        const docRef = firestore().collection('boards').doc(bid)
        const doc = (await docRef.get()).data() as TBoard
        const oldTile = doc.tiles.find((t) => t.uuid === tile.uuid)
        if (!oldTile)
            return docRef.update({
                tiles: firestore.FieldValue.arrayUnion(tile),
                'meta.dateModified': Date.now(),
            })
        const index = doc.tiles.indexOf(oldTile)

        if (tile.displayName !== undefined) {
            doc.tiles[index] = {
                ...tile,
                displayName: tile.displayName?.substring(0, 50),
            }
        } else {
            doc.tiles[index] = tile
        }

        docRef.update({ tiles: doc.tiles, 'meta.dateModified': Date.now() })

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
