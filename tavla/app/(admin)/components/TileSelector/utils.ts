import { NormalizedDropdownItemType } from '@entur/dropdown/dist/types'
import * as Sentry from '@sentry/nextjs'
import { nanoid } from 'nanoid'
import {
    QuayCoordinatesQuery,
    StopPlaceCoordinatesQuery,
    WalkDistanceQuery,
} from 'src/graphql/index'
import { fetchQuery } from 'src/graphql/utils'
import {
    BoardTileDB,
    Coordinate,
    TileColumnDB,
} from 'src/types/db-types/boards'
import { GeoCoordinate, StopPlace } from '../../utils/fetch'

export const DEFAULT_COLUMNS: TileColumnDB[] = ['line', 'destination', 'time']

export type TypeOfPlace =
    | 'stop_place'
    | 'address'
    | 'other'
    | 'current_position'

export const DEFAULT_COMBINED_COLUMNS: TileColumnDB[] = [
    'line',
    'destination',
    'name',
    'platform',
    'time',
]

export function formDataToTiles(data: FormData): BoardTileDB[] {
    const closestStopPlacesJson = data.get('closest_stop_places') as string
    if (!closestStopPlacesJson) return []

    const closestStopPlaces: Array<{
        id: string
        name: string
        county?: string
    }> = JSON.parse(closestStopPlacesJson)

    return closestStopPlaces.map((sp) => ({
        stopPlaceId: sp.id,
        quays: [],
        name: sp.name,
        uuid: nanoid(),
        columns: DEFAULT_COLUMNS,
        county: sp.county || undefined,
    }))
}

export async function getWalkingDistance(
    from?: Coordinate,
    to?: Coordinate,
): Promise<number | undefined> {
    if (!from || !to) return undefined
    try {
        const response = await fetchQuery(WalkDistanceQuery, {
            from: {
                longitude: from.lng,
                latitude: from.lat,
            },
            to: {
                longitude: to.lng,
                latitude: to.lat,
            },
        })
        return response.trip.tripPatterns[0]?.duration ?? undefined
    } catch (error) {
        Sentry.captureMessage(
            'getWalkingDistance failed with from-coordinates ' +
                from +
                ' and to-coordinates' +
                to,
        )
        throw error
    }
}

export async function getStopPlaceCoordinates(
    stopPlaceId?: string,
): Promise<Coordinate> {
    try {
        const response = await fetchQuery(StopPlaceCoordinatesQuery, {
            id: stopPlaceId ?? '',
        })
        return {
            lat: response.stopPlace?.latitude ?? 0,
            lng: response.stopPlace?.longitude ?? 0,
        }
    } catch (error) {
        Sentry.captureMessage(
            'getStopPlaceCoordinates failed for stopPlaceId ' + stopPlaceId,
        )
        throw error
    }
}

export async function getQuayCoordinates(quayId?: string): Promise<Coordinate> {
    try {
        const response = await fetchQuery(QuayCoordinatesQuery, {
            id: quayId ?? '',
        })
        return {
            lat: response.quay?.latitude ?? 0,
            lng: response.quay?.longitude ?? 0,
        }
    } catch (error) {
        Sentry.captureMessage('getQuayCoordinates failed for quayId' + quayId)
        throw error
    }
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

export function getTypeOfPlace(
    placeItem: NormalizedDropdownItemType<StopPlace> | null,
): TypeOfPlace {
    if (placeItem?.value.id === 'current_position') {
        return 'current_position'
    }
    if (placeItem?.value.layer === 'venue') {
        return 'stop_place'
    } else if (placeItem?.value.category?.includes('vegadresse')) {
        return 'address'
    }
    return 'other'
}
