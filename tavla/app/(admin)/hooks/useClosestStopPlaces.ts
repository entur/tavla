import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useEffect, useMemo, useState } from 'react'
import {
    formatDistance,
    haversineDistance,
} from '../components/TileSelector/utils'
import {
    fetchClosestStopPlaces,
    GeoCoordinate,
    StopPlace,
} from '../utils/fetch'

function useClosestStopPlaces(
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
    const [mainStopPlaceItem, setMainStopPlaceItem] =
        useState<NormalizedDropdownItemType<StopPlace> | null>(null)

    const { lat, lon } = coordinates ?? { lat: 0, lon: 0 }

    useEffect(() => {
        if (lat === 0 && lon === 0) {
            setClosestStopPlaceItems([])
            return
        }

        let cancelled = false
        fetchClosestStopPlaces(
            { lat, lon },
            numberOfStopPlaces,
            areaRadiusInKm,
        ).then((items) => {
            if (!cancelled) {
                setClosestStopPlaceItems(items)
            }
        })
        return () => {
            cancelled = true
        }
    }, [lat, lon, numberOfStopPlaces, areaRadiusInKm])

    useEffect(() => {
        if (!mainStopPlaceItem) return
        const matchingItem = closestStopPlaceItems.find(
            (item) => item.value.id === mainStopPlaceItem.value.id,
        )
        if (matchingItem) {
            setMainStopPlaceItem(matchingItem)
            setSelectedClosestStopPlaces((prev) => {
                if (!prev) return [matchingItem]
                return prev.map((p) =>
                    p.value.id === matchingItem.value.id ? matchingItem : p,
                )
            })
        }
    }, [closestStopPlaceItems, mainStopPlaceItem])

    const allClosestItems = useMemo(() => {
        const itemsWithDistance = closestStopPlaceItems.map((item) => {
            if (!coordinates || !item.value.coordinates) return item
            const dist = haversineDistance(coordinates, item.value.coordinates)
            return {
                ...item,
                label: `${item.label} (${formatDistance(dist)})`,
            }
        })

        if (!mainStopPlaceItem) return itemsWithDistance

        const index = itemsWithDistance.findIndex(
            (item) => item.value.id === mainStopPlaceItem.value.id,
        )
        if (index !== -1) {
            const result = [...itemsWithDistance]
            result[index] = mainStopPlaceItem
            return result
        }
        return [mainStopPlaceItem, ...itemsWithDistance]
    }, [mainStopPlaceItem, closestStopPlaceItems, coordinates])

    return {
        closestStopPlaceItems,
        allClosestItems,
        selectedClosestStopPlaces,
        setSelectedClosestStopPlaces,
        mainStopPlaceItem,
        setMainStopPlaceItem,
    }
}

export { useClosestStopPlaces }
