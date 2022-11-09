import { Coordinates } from '../../types'
import { GeocoderResults } from './types'

const endpoint = process.env.GEOCODER_HOST ?? 'https://api.entur.io/geocoder/v1'

function fetchReverse(coordinates: Coordinates): Promise<string | undefined> {
    return fetch(
        `${endpoint}/reverse` +
            `?point.lat=${coordinates.latitude}` +
            `&point.lon=${coordinates.longitude}` +
            `&lang=no` +
            `&size=1` +
            `&boundary.circle.radius=1000`,
    )
        .then((response) => response.json())
        .then((result: GeocoderResults) => result.features[0]?.properties.name)
}

export { fetchReverse }
