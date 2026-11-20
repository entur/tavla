import type { NormalizedDropdownItemType } from '@entur/dropdown'
import type { GeoCoordinate } from 'app/(innlogget)/utils/fetch'
import type { TGeoProperties } from 'app/(innlogget)/utils/geocoder'
import { nanoid } from 'nanoid'
import type { BoardTileDB, TileColumnDB } from 'types/db-types/boards'

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

export type TypeOfPlace =
    | 'stop_place'
    | 'address'
    | 'other'
    | 'current_position'

export function formDataToTiles(
    data: FormData,
    isArrivals = false,
): BoardTileDB[] {
    const closestStopPlacesJson = data.get('closest_stop_places') as string
    if (!closestStopPlacesJson) return []

    const closestStopPlaces: Array<{
        id: string
        name: string
        county?: string
    }> = JSON.parse(closestStopPlacesJson)

    const columns = isArrivals
        ? DEFAULT_ARRIVAL_COLUMNS
        : DEFAULT_DEPARTURE_COLUMNS
    return closestStopPlaces.map((sp) => ({
        stopPlaceId: sp.id,
        name: sp.name,
        uuid: nanoid(),
        columns,
        county: sp.county,
    }))
}

export function sortCountiesAlphabetically(
    counties: NormalizedDropdownItemType[],
): NormalizedDropdownItemType[] {
    return counties.sort((a, b) => a.label.localeCompare(b.label, 'nb'))
}

export function haversineDistance(a: GeoCoordinate, b: GeoCoordinate): number {
    const R = 6371000 // Earth radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const dLat = toRad(b.lat - a.lat)
    const dLon = toRad(b.lon - a.lon)
    const sinLat = Math.sin(dLat / 2)
    const sinLon = Math.sin(dLon / 2)
    const h =
        sinLat * sinLat +
        Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLon * sinLon
    return 2 * R * Math.asin(Math.sqrt(h))
}

export function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} m`
    return `${(meters / 1000).toFixed(1)} km`
}

export function getTypeOfPlace(properties: TGeoProperties): TypeOfPlace {
    switch (properties.layer) {
        case 'stopPlace':
            return 'stop_place'
        case 'address':
        case 'street':
            return 'address'
        case 'poi':
            return 'other'
        default:
            return 'other'
    }
}
