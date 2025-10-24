import { NormalizedDropdownItemType } from '@entur/dropdown/dist/types'
import * as Sentry from '@sentry/nextjs'
import {
    QuayCoordinatesQuery,
    StopPlaceCoordinatesQuery,
    WalkDistanceQuery,
} from 'graphql/index'
import { fetchQuery } from 'graphql/utils'
import { nanoid } from 'nanoid'
import { BoardTileDB, CoordinateDB, TileColumnDB } from 'types/db-types/boards'

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

    const placeId = quayId ? quayId : stopPlaceId
    return {
        type: placeId !== stopPlaceId ? 'quay' : 'stop_place',
        name: `${stopPlaceName[0]}${
            quayName === 'Vis alle' || quayName === ''
                ? ''
                : ' ' + quayName.trim()
        }, ${stopPlaceName[1]}`,
        uuid: nanoid(),
        placeId,
        columns: DEFAULT_COLUMNS,
    }
}

export async function getWalkingDistance(from: CoordinateDB, to: CoordinateDB) {
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
        return response.trip.tripPatterns[0]?.duration
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
    stopPlaceId: string,
): Promise<CoordinateDB> {
    try {
        const response = await fetchQuery(StopPlaceCoordinatesQuery, {
            id: stopPlaceId,
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

export async function getQuayCoordinates(
    quayId: string,
): Promise<CoordinateDB> {
    try {
        const response = await fetchQuery(QuayCoordinatesQuery, {
            id: quayId,
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
