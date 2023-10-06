import { useToast } from '@entur/alert'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useEditSettingsDispatch } from 'Admin/scenarios/Edit/utils/contexts'
import { fetchStopPlaces } from 'Admin/utils/fetch'
import { useDebouncedFetch } from 'hooks/useDebouncedFetch'
import { useCallback, useState } from 'react'

function useStopPlaceSearch(countyIds?: number[]) {
    const dispatch = useEditSettingsDispatch()
    const { addToast } = useToast()
    const [selectedStopPlace, setSelectedStopPlace] =
        useState<NormalizedDropdownItemType | null>(null)

    const items = useCallback(
        (search: string) => fetchStopPlaces(search, countyIds),
        [countyIds],
    )
    const debouncedFetch = useDebouncedFetch(500, items)

    const handleAddTile = () => {
        if (!selectedStopPlace?.value) {
            addToast({
                title: 'Ingen holdeplass er valgt',
                content: 'Vennligst velg en holdeplass å legge til',
                variant: 'info',
            })
            return
        }
        dispatch({
            type: 'addTile',
            tile: {
                type: 'stop_place',
                placeId: selectedStopPlace.value,
                name: selectedStopPlace.label.split(',')[0] ?? 'Ikke navngitt',
            },
        })
        setSelectedStopPlace(null)
    }

    return {
        stopPlaceItems: debouncedFetch,
        selectedStopPlace,
        setSelectedStopPlace,
        handleAddTile,
    }
}

export { useStopPlaceSearch }
