import { NormalizedDropdownItemType } from '@entur/dropdown'
import { fetchStopPlaces } from 'Admin/utils/fetch'
import { useDebouncedFetch } from 'hooks/useDebouncedFetch'
import { useCallback, useState } from 'react'

function useStopPlaceSearch(countyIds?: string[]) {
    const [selectedStopPlace, setSelectedStopPlace] =
        useState<NormalizedDropdownItemType | null>(null)

    const items = useCallback(
        (search: string) => fetchStopPlaces(search, countyIds),
        [countyIds],
    )
    const debouncedFetch = useDebouncedFetch(500, items)

    return {
        stopPlaceItems: debouncedFetch,
        selectedStopPlace,
        setSelectedStopPlace,
    }
}

export { useStopPlaceSearch }
