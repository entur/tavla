import { nanoid } from 'nanoid'
import type { BoardTileDB, TileColumnDB } from 'types/db-types/boards'
import type { z } from 'zod'
import type { closestStopPlacesSchema } from './validation'

const DEFAULT_DEPARTURE_COLUMNS: TileColumnDB[] = [
    'line',
    'destination',
    'time',
]
const DEFAULT_ARRIVAL_COLUMNS: TileColumnDB[] = [
    'line',
    'fromStopPlace',
    'destination',
    'time',
]

export function closestStopPlacesToTiles(
    closestStopPlaces: z.infer<typeof closestStopPlacesSchema>,
    isArrivals = false,
): BoardTileDB[] {
    const columns = isArrivals
        ? DEFAULT_ARRIVAL_COLUMNS
        : DEFAULT_DEPARTURE_COLUMNS
    return closestStopPlaces.map((sp) => ({
        stopPlaceId: sp.id,
        quays: [],
        name: sp.name,
        uuid: nanoid(),
        columns,
        county: sp.county,
    }))
}
