import { useState, useEffect } from 'react'
import { NearestPlace, Coordinates } from '@entur/sdk'

import service from '../service'

export default function useNearestPlaces(position: Coordinates, distance: number): Array<NearestPlace> {
    const [nearestPlaces, setNearestPlaces] = useState<Array<NearestPlace>>([])

    useEffect(() => {
        service.getNearestPlaces(position, {
            maximumDistance: distance,
            filterByPlaceTypes: ['StopPlace', 'BikeRentalStation'],
            multiModalMode: 'parent',
        }).then(setNearestPlaces)
    }, [distance, position])

    return nearestPlaces
}
