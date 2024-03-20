'use server'
import { firestore } from 'firebase-admin'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { TBoard, TBoardID, TOrganization } from 'types/settings'
import { TTile } from 'types/tile'
import { revalidatePath } from 'next/cache'
import { getWalkingDistance } from 'app/(admin)/components/TileSelector/utils'

initializeAdminApp()

export async function deleteTile(bid: TBoardID, tile: TTile) {
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
    const docRef = firestore().collection('boards').doc(bid)
    const doc = (await docRef.get()).data() as TBoard
    const oldTile = doc.tiles.find((t) => t.uuid === tile.uuid)
    if (!oldTile)
        return docRef.update({
            tiles: firestore.FieldValue.arrayUnion(tile),
            'meta.dateModified': Date.now(),
        })
    const index = doc.tiles.indexOf(oldTile)
    if (doc.meta.location && tile.showDistance) {
        const walkingDistance = await getWalkingDistance(
            tile.placeId,
            doc.meta.location,
        )
        if (walkingDistance) {
            doc.tiles[index] = {
                ...tile,
                distance: Number(walkingDistance),
            }
            docRef.update({
                tiles: doc.tiles,
                'meta.dateModified': Date.now(),
            })
            revalidatePath(`edit/${bid}`)
            return
        }
    }
    doc.tiles[index] = tile
    docRef.update({ tiles: doc.tiles, 'meta.dateModified': Date.now() })

    revalidatePath(`/edit/${bid}`)
}

export async function getOrganizationForBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()
    return ref.docs.map((doc) => doc.data() as TOrganization)[0]
}
