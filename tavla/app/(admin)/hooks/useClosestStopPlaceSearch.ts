import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useEffect, useState } from 'react'
import { fetchClosestStopPlaces, stopPlace } from '../utils/fetch'

function useClosestStopPlaceSearch(
    coordinates: [number, number],
    numberOfStopPlaces: number,
) {
    const [selectedClosestStopPlaces, setSelectedClosestStopPlaces] = useState<
        NormalizedDropdownItemType<stopPlace>[] | null
    >(null)
    const [closestStopPlaceItems, setClosestStopPlaceItems] = useState<
        NormalizedDropdownItemType<stopPlace>[]
    >([])

    const lat = coordinates[0]
    const lon = coordinates[1]

    useEffect(() => {
        if (lat === 0 && lon === 0) {
            setClosestStopPlaceItems([])
            return
        }

        let cancelled = false
        fetchClosestStopPlaces([lat, lon], numberOfStopPlaces).then((items) => {
            if (!cancelled) {
                setClosestStopPlaceItems(items)
            }
        })
        return () => {
            cancelled = true
        }
    }, [lat, lon, numberOfStopPlaces])

    return {
        closestStopPlaceItems,
        selectedClosestStopPlaces,
        setSelectedClosestStopPlaces,
    }
}

export { useClosestStopPlaceSearch }
