import { useState, useEffect } from 'react'
import { NearestPlace, Coordinates, TypeName } from '@entur/sdk'

import service from '../service'

export default function useNearestPlaces(
    position: Coordinates | undefined,
    distance: number | undefined,
): NearestPlace[] {
    const [nearestPlaces, setNearestPlaces] = useState<NearestPlace[]>([])

    useEffect(() => {
        if (!position || !distance) return
        let ignoreResponse = false

        service
            .getNearestPlaces(position, {
                maximumDistance: distance,
                filterByPlaceTypes: [
                    TypeName.STOP_PLACE,
                    TypeName.BIKE_RENTAL_STATION,
                ],
                multiModalMode: 'parent',
            })
            .then((places) => {
                if (ignoreResponse) return
                setNearestPlaces(places)
            })

        return (): void => {
            ignoreResponse = true
        }
    }, [distance, position])

    return nearestPlaces
}
