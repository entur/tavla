import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { PositionIcon } from '@entur/icons'
import type { GeoCoordinate, Place } from './fetch'

export async function getCurrentPosition(
    options?: PositionOptions,
): Promise<GeolocationPosition> {
    if (!navigator?.geolocation) {
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

export const coordinatesToPlaceDropdownItem = (
    coordinates?: GeoCoordinate,
): NormalizedDropdownItemType<Place> => ({
    value: {
        id: 'current_position',
        layer: 'position',
        type: 'current_position',
        coordinates,
    },
    label: 'Posisjonen din',
    icons: [PositionIcon],
})
