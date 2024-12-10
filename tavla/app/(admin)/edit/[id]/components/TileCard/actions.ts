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
import { SWITCH_DATE, NEW_LINE_IDS, OLD_LINE_IDS } from '../../compatibility'

initializeAdminApp()

export async function deleteTile(bid: TBoardID, tile: TTile) {
    const access = await hasBoardOwnerAccess(bid)
    if (!access) return redirect('/')

    // TODO: refactor 15. december when new lines are active
    if (tile.whitelistedLines) {
        if (Date.now() < Date.parse(SWITCH_DATE.toString())) {
            tile.whitelistedLines = tile.whitelistedLines.filter(
                (line) => !NEW_LINE_IDS.includes(line),
            )
        } else {
            tile.whitelistedLines = tile.whitelistedLines.filter(
                (line) => !OLD_LINE_IDS.includes(line),
            )
        }
    }

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            tiles: firestore.FieldValue.arrayRemove(tile),
            'meta.dateModified': Date.now(),
        })
    revalidatePath(`/edit/${bid}`)
}

export async function saveTile(bid: TBoardID, tile: TTile) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

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
}

export async function getOrganizationForBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()

    return ref.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as TOrganization,
    )[0]
}
