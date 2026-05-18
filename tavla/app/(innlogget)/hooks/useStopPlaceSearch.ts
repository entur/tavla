import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { usePostHog } from 'posthog-js/react'
import { useCallback, useRef, useState } from 'react'
import { fetchStopPlaces, type StopPlace } from '../utils/fetch'

function useStopPlaceSearch(countyIds?: string[]) {
    const [selectedStopPlace, setSelectedStopPlace] =
        useState<NormalizedDropdownItemType<StopPlace> | null>(null)

    const posthog = usePostHog()

    const count = useRef(0)

    const items = useCallback(
        async (search: string) => {
            if (search !== '') count.current += 1
            return await fetchStopPlaces(search, countyIds)
        },
        [countyIds],
    )
    const chooseStopPlace = (
        stopPlace: NormalizedDropdownItemType<StopPlace> | null,
    ) => {
        if (stopPlace) {
            posthog.capture('EDIT_STOP_PLACE_SEARCH', {
                counties: countyIds && countyIds.length > 0,
                count: count.current,
            })
        }
        setSelectedStopPlace(stopPlace)
        count.current = 0
    }

    return {
        stopPlaceItems: items,
        selectedStopPlace,
        setSelectedStopPlace: chooseStopPlace,
    }
}

export { useStopPlaceSearch }
