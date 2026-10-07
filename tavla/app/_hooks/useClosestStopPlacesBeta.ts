import type { NormalizedDropdownItemType } from '@entur/dropdown'
import {
    formatDistance,
    haversineDistance,
} from 'app/_components/TileSelector/utils'
import {
    fetchClosestStopPlaces,
    type GeoCoordinate,
    type StopPlace,
} from 'app/(innlogget)/utils/fetch'
import { useEffect, useMemo, useState } from 'react'

function useClosestStopPlacesBeta(
    coordinates: GeoCoordinate | undefined,
    numberOfStopPlaces: number,
    areaRadiusInKm: number,
) {
    const [closestStopPlaceItems, setClosestStopPlaceItems] = useState<
        NormalizedDropdownItemType<StopPlace>[]
    >([])
    const [selectedClosestStopPlaces, setSelectedClosestStopPlaces] = useState<
        NormalizedDropdownItemType<StopPlace>[] | null
    >(null)

    const [loadedCoordinatesKey, setLoadedCoordinatesKey] = useState<
        string | null
    >(null)

    const { lat, lon } = coordinates ?? { lat: 0, lon: 0 }
    const coordinatesKey = `${lat},${lon}`
    const hasCoordinates = !(lat === 0 && lon === 0)
    const isLoading = hasCoordinates && loadedCoordinatesKey !== coordinatesKey

    useEffect(() => {
        if (lat === 0 && lon === 0) {
            setClosestStopPlaceItems([])
            setLoadedCoordinatesKey(null)
            return
        }

        let cancelled = false
        setClosestStopPlaceItems([])
        fetchClosestStopPlaces({ lat, lon }, numberOfStopPlaces, areaRadiusInKm)
            .then((items) => {
                if (!cancelled) {
                    setClosestStopPlaceItems(items)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setClosestStopPlaceItems([])
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadedCoordinatesKey(`${lat},${lon}`)
                }
            })
        return () => {
            cancelled = true
        }
    }, [lat, lon, numberOfStopPlaces, areaRadiusInKm])

    const allClosestItems = useMemo(() => {
        const itemsWithDistance = closestStopPlaceItems.map((item) => {
            if (!coordinates || !item.value.coordinates) return item
            const dist = haversineDistance(coordinates, item.value.coordinates)
            return {
                ...item,
                label: `${item.label} (${formatDistance(dist)})`,
            }
        })

        return itemsWithDistance
    }, [closestStopPlaceItems, coordinates])

    return {
        closestStopPlaceItems,
        allClosestItems,
        isLoading,
        selectedClosestStopPlaces,
        setSelectedClosestStopPlaces,
    }
}

export { useClosestStopPlacesBeta }
