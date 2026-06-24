'use server'
import {
    addTiles,
    getTileWithWalkingDistance,
} from 'app/(innlogget)/tavler/[id]/rediger/actions'
import type {
    BoardDB,
    BoardTileDB,
    LocationDB,
} from 'src/types/db-types/boards'

/**
 * Adds tiles to an existing board, computing walking distance relative to the
 * board location when one is set. Returns the persisted tiles (with walking
 * distance) so the client can update its in-memory board for the live preview.
 */
export async function addBetaTiles(
    bid: BoardDB['id'],
    tiles: BoardTileDB[],
    location: LocationDB | undefined,
): Promise<BoardTileDB[]> {
    const tilesWithDistance = await Promise.all(
        tiles
            .filter((tile) => tile.stopPlaceId)
            .map((tile) => getTileWithWalkingDistance(tile, location)),
    )

    if (tilesWithDistance.length === 0) return []

    await addTiles(bid, tilesWithDistance)
    return tilesWithDistance
}
