'use server'
import { getWalkingDistanceTile } from 'app/(admin)/tavler/[id]/rediger/actions'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { BoardDB, BoardTileDB, LocationDB } from 'src/types/db-types/boards'

initializeAdminApp()

export async function publishBoard(board: BoardDB): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...boardData } = board // We don't want to use the localStorage board ID in firebase, so we remove it before saving. Firebase will generate a new ID for us.

    const now = Date.now()
    const doc = await firestore()
        .collection('boards')
        .add({
            ...boardData,
            meta: {
                ...boardData.meta,
                created: now,
                dateModified: now,
            },
        })
    return doc.id
}

export async function getTilesWithWalkingDistance(
    tiles: BoardTileDB[],
    location: LocationDB | undefined,
): Promise<BoardTileDB[]> {
    return Promise.all(
        tiles.map(async (tile) => {
            if (!location) {
                delete tile.walkingDistance
                return tile
            }
            return getWalkingDistanceTile(tile, location)
        }),
    )
}
