import {
    QuayCoordinatesQuery,
    StopPlaceCoordinatesQuery,
    WalkDistanceQuery,
} from 'graphql/index'
import { fetchQuery } from 'graphql/utils'
import { nanoid } from 'nanoid'
import { DEFAULT_COLUMNS } from 'types/column'
import { TCoordinate } from 'types/meta'
import { TTile } from 'types/tile'
import * as Sentry from '@sentry/nextjs'

export function formDataToTile(data: FormData) {
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
    } as TTile
}

export async function getWalkingDistance(from: TCoordinate, to: TCoordinate) {
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

export async function getStopPlaceCoordinates(stopPlaceId: string) {
    try {
        const response = await fetchQuery(StopPlaceCoordinatesQuery, {
            id: stopPlaceId,
        })
        return {
            lat: response.stopPlace?.latitude ?? 0,
            lng: response.stopPlace?.longitude ?? 0,
        } as TCoordinate
    } catch (error) {
        Sentry.captureMessage(
            'getStopPlaceCoordinates failed for stopPlaceId ' + stopPlaceId,
        )
        throw error
    }
}

export async function getQuayCoordinates(quayId: string) {
    try {
        const response = await fetchQuery(QuayCoordinatesQuery, {
            id: quayId,
        })
        return {
            lat: response.quay?.latitude ?? 0,
            lng: response.quay?.longitude ?? 0,
        } as TCoordinate
    } catch (error) {
        Sentry.captureMessage('getQuayCoordinates failed for quayId' + quayId)
        throw error
    }
}
