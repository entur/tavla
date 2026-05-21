'use server'
import { getWalkingDistanceTile } from 'app/(innlogget)/tavler/[id]/rediger/actions'
import { initializeAdminApp } from 'app/(innlogget)/utils/firebase'
import { addBoard } from 'src/firebase'
import type {
    BoardDB,
    BoardTileDB,
    LocationDB,
} from 'src/types/db-types/boards'

initializeAdminApp()

export async function publishBoard(board: BoardDB): Promise<string> {
    const { id: _id, ...boardData } = board // We don't want to use the localStorage board ID in firebase, so we remove it before saving. Firebase will generate a new ID for us.

    const doc = await addBoard({
        ...boardData,
        meta: {
            ...boardData.meta,
        },
        isAnonymousBoard: true,
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
