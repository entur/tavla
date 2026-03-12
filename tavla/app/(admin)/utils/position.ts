import { PositionIcon } from '@entur/icons'
import { GeoCoordinate } from './fetch'

export async function getCurrentPosition(
    options?: PositionOptions,
): Promise<GeolocationPosition> {
    if (!navigator || !navigator.geolocation) {
        throw new Error('navigator.geolocation is not defined')
    }

    const mergedOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        ...options,
    }

    return new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, mergedOptions)
    })
}

export const positionDropDownItem = (coordinates?: GeoCoordinate) => ({
    value: {
        id: 'current_position',
        layer: 'position',
        coordinates,
    },
    label: 'Posisjonen din',
    icons: [PositionIcon],
})
