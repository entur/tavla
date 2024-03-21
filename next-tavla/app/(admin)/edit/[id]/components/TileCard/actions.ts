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
import { getWalkingDistance } from 'app/(admin)/components/TileSelector/utils'

initializeAdminApp()

export async function deleteTile(bid: TBoardID, tile: TTile) {
    const access = await hasBoardOwnerAccess(bid)
    if (!access) return redirect('/')

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
    if (doc.meta.location && tile.walkingDistance?.visible) {
        const distance = await getWalkingDistance(
            tile.placeId,
            doc.meta.location,
        )
        if (distance) {
            doc.tiles[index] = {
                ...tile,
                walkingDistance: {
                    distance: Number(distance),
                    visible: tile.walkingDistance.visible,
                },
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
