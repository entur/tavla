import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useEffect, useState } from 'react'
import { StopPlacesByBboxQuery } from 'src/graphql/index'
import { useQuery } from 'src/hooks/useQuery'
import { stopPlace } from '../utils/fetch'
import {
    Coordinate,
    calculateBoundingBox,
    calculateDistance,
    formatDistance,
} from './distanceUtils'

/**
 * Hook to fetch stop places within a radius of a center coordinate
 * Defaults to 200m radius
 */
function useStopPlacesByBbox(center?: Coordinate, radiusMeters = 500) {
    const [stopPlaces, setStopPlaces] = useState<
        NormalizedDropdownItemType<stopPlace>[]
    >([])

    const bbox = center ? calculateBoundingBox(center, radiusMeters) : null

    // Only run query if we have a center coordinate
    const {
        data,
        isLoading: queryLoading,
        error: queryError,
    } = useQuery(StopPlacesByBboxQuery, {
        minLat: bbox?.minLat ?? 0,
        minLng: bbox?.minLng ?? 0,
        maxLat: bbox?.maxLat ?? 0,
        maxLng: bbox?.maxLng ?? 0,
    })

    // Transform and sort results by distance
    useEffect(() => {
        if (!center || !data?.stopPlacesByBbox) {
            setStopPlaces([])
            return
        }

        // Create array with distance calculations
        const placesWithDistance = data.stopPlacesByBbox
            .filter(
                (sp): sp is NonNullable<typeof sp> =>
                    sp !== null &&
                    sp.latitude !== null &&
                    sp.longitude !== null,
            )
            .map((sp) => ({
                place: sp,
                distance: calculateDistance(center, {
                    lat: sp.latitude!,
                    lng: sp.longitude!,
                }),
            }))
            .sort((a, b) => a.distance - b.distance)

        // Transform to dropdown items with distance in label
        const dropdownItems: NormalizedDropdownItemType<stopPlace>[] =
            placesWithDistance.map(({ place, distance }) => ({
                value: {
                    id: place.id,
                    county: undefined,
                },
                label: `${place.name} (${formatDistance(distance)})`,
            }))

        setStopPlaces(dropdownItems)
    }, [data, center])

    return {
        stopPlaces,
        loading: queryLoading,
        error: queryError,
    }
}

export { useStopPlacesByBbox }
