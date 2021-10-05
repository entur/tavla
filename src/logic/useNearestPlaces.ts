import { useState, useEffect } from 'react'

import { NearestPlace, Coordinates, TypeName } from '@entur/sdk'

import service from '../service'

export default function useNearestPlaces(
    position: Coordinates | undefined,
    distance: number | undefined,
): NearestPlace[] {
    const [nearestPlaces, setNearestPlaces] = useState<NearestPlace[]>([])

    const { latitude, longitude } = position ?? {}

    useEffect(() => {
        if (!latitude || !longitude || !distance) return
        let ignoreResponse = false

        service
            .getNearestPlaces(
                { latitude, longitude },
                {
                    maximumDistance: distance,
                    filterByPlaceTypes: [
                        TypeName.STOP_PLACE,
                        TypeName.BIKE_RENTAL_STATION,
                    ],
                    multiModalMode: 'parent',
                },
            )
            .then((places) => {
                if (ignoreResponse) return
                setNearestPlaces(places)
            })

        return (): void => {
            ignoreResponse = true
        }
    }, [distance, latitude, longitude])

    return nearestPlaces
}
