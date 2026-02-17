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

export const DEFAULT_COLUMNS: TileColumnDB[] = ['line', 'destination', 'time']

export const DEFAULT_COMBINED_COLUMNS: TileColumnDB[] = [
    'line',
    'destination',
    'name',
    'platform',
    'time',
]

export function formDataToTile(data: FormData): BoardTileDB {
    const quayId = data.get('quay') as string
    const stopPlaceId = data.get('stop_place') as string
    const stopPlaceName = (data.get('stop_place_name') as string).split(',')
    const quayName = data.get('quay_name') as string
    const county = data.get('county') as string

    const placeId = quayId ? quayId : stopPlaceId
    const type = placeId !== stopPlaceId ? 'quay' : 'stop_place'

    return {
        type: type,
        stopPlaceId: stopPlaceId,
        quays: type === 'quay' ? [{ id: quayId, whitelistedLines: [] }] : [],
        name: `${stopPlaceName[0]}${
            quayName === 'Vis alle' || quayName === ''
                ? ''
                : ' ' + quayName.trim()
        }, ${stopPlaceName[1]}`,
        uuid: nanoid(),
        placeId,
        columns: DEFAULT_COLUMNS,
        county: county || undefined,
    }
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
