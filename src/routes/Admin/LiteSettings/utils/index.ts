import { TTile } from '../types/tile'

export function addUUID(tiles: TTile[]) {
    return tiles.map((t, i) => ({ ...t, uuid: `${Date.now()}_${i}` }))
}
