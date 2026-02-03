import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useMemo, useState } from 'react'
import { LocationDB } from 'src/types/db-types/boards'
import { stopPlace } from '../utils/fetch'
import { usePointSearch } from './usePointSearch'
import { useStopPlacesByBbox } from './useStopPlacesByBbox'

/**
 * Hook that combines address/POI search with nearby stop place search
 * User workflow:
 * 1. Type address → search for addresses/POIs via usePointSearch
 * 2. Select address → fetches stop places within 200m radius
 * 3. Select stop place from results
 */
function useAddressThenStopPlaces(radiusMeters = 500) {
    // Address/POI search
    const { pointItems, selectedPoint, setSelectedPoint } = usePointSearch()

    // Memoize the coordinate to prevent infinite loops
    const centerCoordinate = useMemo(() => {
        if (!selectedPoint?.value?.coordinate) return undefined
        return {
            lat: selectedPoint.value.coordinate.lat,
            lng: selectedPoint.value.coordinate.lng,
        }
    }, [selectedPoint?.value?.coordinate])

    // Stop places within radius
    const {
        stopPlaces,
        loading: loadingStopPlaces,
        error: errorStopPlaces,
    } = useStopPlacesByBbox(centerCoordinate, radiusMeters)

    // Selected stop place
    const [selectedStopPlace, setSelectedStopPlace] =
        useState<NormalizedDropdownItemType<stopPlace> | null>(null)

    // Reset stop place selection when address changes
    const handleSelectPoint = useCallback(
        (point: NormalizedDropdownItemType<LocationDB> | null) => {
            setSelectedPoint(point)
            setSelectedStopPlace(null)
        },
        [setSelectedPoint],
    )

    return {
        // Address search
        pointItems,
        selectedPoint,
        setSelectedPoint: handleSelectPoint,

        // Stop place results
        stopPlaces,
        selectedStopPlace,
        setSelectedStopPlace,

        // Loading states
        loadingStopPlaces,
        errorStopPlaces,
    }
}

export { useAddressThenStopPlaces }
