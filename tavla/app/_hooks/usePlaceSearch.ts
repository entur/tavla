import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { fetchPlaces, type Place } from 'app/(innlogget)/utils/fetch'
import { usePostHog } from 'posthog-js/react'
import { useCallback, useRef, useState } from 'react'

function usePlaceSearch(countyIds?: string[]) {
    const [selectedPlace, setSelectedPlace] =
        useState<NormalizedDropdownItemType<Place> | null>(null)

    const posthog = usePostHog()

    const count = useRef(0)

    const items = useCallback(
        async (search: string) => {
            if (search !== '') count.current += 1
            return await fetchPlaces(search, countyIds)
        },
        [countyIds],
    )
    const choosePlace = (place: NormalizedDropdownItemType<Place> | null) => {
        if (place) {
            posthog.capture('EDIT_STOP_PLACE_SEARCH', {
                counties: countyIds && countyIds.length > 0,
                count: count.current,
            })
        }
        setSelectedPlace(place)
        count.current = 0
    }

    return {
        placeItems: items,
        selectedPlace,
        setSelectedPlace: choosePlace,
    }
}

export { usePlaceSearch }
