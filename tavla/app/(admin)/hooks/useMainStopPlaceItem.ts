import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useEffect, useMemo, useState } from 'react'
import {
    formatDistance,
    haversineDistance,
} from '../components/TileSelector/utils'
import { stopPlace } from '../utils/fetch'

function useMainStopPlaceItem(
    closestStopPlaceItems: NormalizedDropdownItemType<stopPlace>[],
    mainCoordinates: [number, number] | undefined,
    setSelectedClosestStopPlaces: React.Dispatch<
        React.SetStateAction<NormalizedDropdownItemType<stopPlace>[] | null>
    >,
) {
    const [mainStopPlaceItem, setMainStopPlaceItem] =
        useState<NormalizedDropdownItemType<stopPlace> | null>(null)

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
    }, [closestStopPlaceItems, mainStopPlaceItem, setSelectedClosestStopPlaces])

    const allClosestItems = useMemo(() => {
        const itemsWithDistance = closestStopPlaceItems.map((item) => {
            if (!mainCoordinates || !item.value.coordinates) return item
            const dist = haversineDistance(
                mainCoordinates,
                item.value.coordinates,
            )
            return {
                ...item,
                label: `${item.label} (${formatDistance(dist)})`,
            }
        })

        if (!mainStopPlaceItem) return itemsWithDistance
        const alreadyIncluded = itemsWithDistance.some(
            (item) => item.value.id === mainStopPlaceItem.value.id,
        )
        return alreadyIncluded
            ? itemsWithDistance
            : [mainStopPlaceItem, ...itemsWithDistance]
    }, [mainStopPlaceItem, closestStopPlaceItems, mainCoordinates])

    return {
        mainStopPlaceItem,
        setMainStopPlaceItem,
        allClosestItems,
    }
}

export { useMainStopPlaceItem }
