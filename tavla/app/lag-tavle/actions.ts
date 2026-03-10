'use server'
import { getWalkingDistanceTile } from 'app/(admin)/tavler/[id]/rediger/actions'
import { BoardTileDB, LocationDB } from 'src/types/db-types/boards'

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
