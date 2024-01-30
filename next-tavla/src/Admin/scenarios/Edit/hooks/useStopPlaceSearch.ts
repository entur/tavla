import { NormalizedDropdownItemType } from '@entur/dropdown'
import { fetchStopPlaces } from 'Admin/utils/fetch'
import { useCallback, useState } from 'react'

function useStopPlaceSearch(countyIds?: string[]) {
    const [selectedStopPlace, setSelectedStopPlace] =
        useState<NormalizedDropdownItemType | null>(null)

    const items = useCallback(
        (search: string) => fetchStopPlaces(search, countyIds),
        [countyIds],
    )

    return {
        stopPlaceItems: items,
        selectedStopPlace,
        setSelectedStopPlace,
    }
}

export { useStopPlaceSearch }
