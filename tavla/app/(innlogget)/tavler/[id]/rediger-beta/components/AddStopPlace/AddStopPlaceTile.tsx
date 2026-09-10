'use client'
import {
    MultiSelect,
    type NormalizedDropdownItemType,
    SearchableDropdown,
} from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { Paragraph } from '@entur/typography'
import { HiddenInput } from 'app/_components/Form/HiddenInput'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import { useClosestStopPlaces } from 'app/_hooks/useClosestStopPlaces'
import useCurrentPosition from 'app/_hooks/useCurrentPosition'
import { useStopPlaceSearch } from 'app/_hooks/useStopPlaceSearch'
import type { StopPlace } from 'app/(innlogget)/utils/fetch'
import { coordinatesToStopPlaceDropdownItem } from 'app/(innlogget)/utils/position'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useActionState, useState } from 'react'
import type { BoardDB } from 'types/db-types/boards'
import { type AddStopPlaceFormState, addStopPlaceTiles } from './actions'

const NUMBER_OF_CLOSEST_STOP_PLACES = 10
const AREA_RADIUS_IN_KM = 20

function AddStopPlaceTile({ board }: { board: BoardDB }) {
    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch()

    const {
        closestStopPlaceItems,
        allClosestItems,
        selectedClosestStopPlaces,
        setSelectedClosestStopPlaces,
        setMainStopPlaceItem,
    } = useClosestStopPlaces(
        selectedStopPlace?.value.coordinates,
        NUMBER_OF_CLOSEST_STOP_PLACES,
        AREA_RADIUS_IN_KM,
    )

    const { fetchPosition } = useCurrentPosition()

    const { capture } = usePosthogTracking()

    const [positionError, setPositionError] = useState<string | undefined>()

    async function handleAddStopPlaces(
        _prevState: AddStopPlaceFormState,
        formData: FormData,
    ): Promise<AddStopPlaceFormState> {
        capture('stop_place_added', {
            location: 'edit_board_page',
            typeOfPlace: selectedStopPlace?.value.type ?? 'other',
            selectedIndexes:
                selectedClosestStopPlaces?.map((selected) =>
                    closestStopPlaceItems.findIndex(
                        (closestItem) =>
                            closestItem.value.id === selected.value.id,
                    ),
                ) ?? [],
        })
        if (!selectedStopPlace) {
            return {
                status: 'error',
                message: 'Du må velge adresse, stoppesed eller sted',
                field: 'stop_place',
            }
        }

        const result = await addStopPlaceTiles(
            board.id,
            formData,
            board.isArrivals,
            board.meta.location,
        )

        setSelectedClosestStopPlaces(null)

        return result
    }

    const [state, formAction, isPending] = useActionState(
        handleAddStopPlaces,
        null,
    )

    const stopPlaceError =
        (state?.status === 'error' && state.field === 'stop_place'
            ? state.message
            : undefined) ?? positionError

    const closestStopPlacesError =
        state?.status === 'error' && state.field === 'closest_stop_places'
            ? state.message
            : undefined

    async function searchStopPlaces(search: string) {
        const stopPlaces = await stopPlaceItems(
            search || selectedStopPlace?.label.split(',')[0] || '',
        )
        return [
            search === '' ? coordinatesToStopPlaceDropdownItem() : null,
            ...stopPlaces,
        ].filter(Boolean) as NormalizedDropdownItemType<StopPlace>[]
    }

    function handlePlaceChange(
        selectedItem: NormalizedDropdownItemType<StopPlace> | null,
    ) {
        if (selectedItem?.value.id === 'current_position') {
            fetchPosition().then((pos) => {
                if (pos) {
                    const coords = {
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                    }
                    setSelectedStopPlace(
                        coordinatesToStopPlaceDropdownItem(coords),
                    )
                } else {
                    setSelectedStopPlace(null)
                    setPositionError('Kunne ikke hente posisjonen din')
                }
            })
            return
        }

        const typeOfPlace = selectedItem?.value.type

        capture('stop_place_add_interaction', {
            location: 'edit_board_page',
            field: 'stop_place',
            action: selectedItem?.value ? 'selected' : 'cleared',
            typeOfPlace: typeOfPlace ?? 'other',
        })
        setSelectedStopPlace(selectedItem)

        if (!selectedItem) {
            setMainStopPlaceItem(null)
            setSelectedClosestStopPlaces(null)
            return
        }

        const item = {
            value: {
                id: selectedItem.value.id,
                county: selectedItem.value.county,
                type: typeOfPlace ?? 'other',
            },
            label: selectedItem.label,
        }
        if (typeOfPlace === 'stop_place') {
            setMainStopPlaceItem(item)
            setSelectedClosestStopPlaces([item])
        } else {
            setMainStopPlaceItem(null)
            setSelectedClosestStopPlaces(null)
        }
    }

    function handleClosestStopPlacesChange(
        selectedItems: NormalizedDropdownItemType<StopPlace>[],
    ) {
        const addedStopPlace =
            selectedItems.length > (selectedClosestStopPlaces?.length ?? 0)
        capture('stop_place_add_interaction', {
            location: 'edit_board_page',
            field: 'closest_stop_places',
            action: addedStopPlace ? 'added' : 'removed',
            typeOfPlace: selectedStopPlace?.value.type ?? 'other',
            selectedIndexes: selectedItems.map((selectedItem) =>
                closestStopPlaceItems.findIndex(
                    (closestItem) =>
                        closestItem.value.id === selectedItem.value.id,
                ),
            ),
        })
        setSelectedClosestStopPlaces(selectedItems)
    }

    return (
        <form
            className="mr-6 flex w-full flex-col gap-4 lg:flex-col"
            action={formAction}
        >
            <div className="w-full">
                <Paragraph margin="none">
                    Skriv inn adresse, stoppesed eller sted
                </Paragraph>
                <SearchableDropdown
                    noMatchesText="Ingen stoppesteder funnet"
                    items={searchStopPlaces}
                    label="Stoppested eller adresse*"
                    clearable
                    prepend={<SearchIcon aria-hidden />}
                    selectedItem={selectedStopPlace}
                    onChange={handlePlaceChange}
                    debounceTimeout={200}
                    aria-required
                    variant={
                        !selectedStopPlace && stopPlaceError
                            ? 'negative'
                            : undefined
                    }
                    feedback={
                        !selectedStopPlace && stopPlaceError
                            ? stopPlaceError
                            : undefined
                    }
                />
            </div>
            <div className="w-full">
                <Paragraph margin="none">Stoppesteder i nærheten</Paragraph>
                <MultiSelect
                    hideSelectAll={true}
                    items={allClosestItems}
                    label="Stoppesteder i nærheten"
                    prepend={<SearchIcon aria-hidden />}
                    selectedItems={selectedClosestStopPlaces ?? []}
                    onChange={handleClosestStopPlacesChange}
                    variant={
                        !selectedClosestStopPlaces?.length &&
                        closestStopPlacesError
                            ? 'negative'
                            : undefined
                    }
                    feedback={
                        !selectedClosestStopPlaces?.length &&
                        closestStopPlacesError
                            ? closestStopPlacesError
                            : undefined
                    }
                />
            </div>
            <HiddenInput
                id="closest_stop_places"
                value={JSON.stringify(
                    (selectedClosestStopPlaces ?? []).map((sp) => ({
                        id: sp.value.id,
                        name: sp.value.name,
                        county: sp.value.county,
                    })),
                )}
            />

            <SubmitButton
                variant="primary"
                className="w-full"
                disabled={isPending}
            >
                Legg til stoppesteder
            </SubmitButton>
        </form>
    )
}

export { AddStopPlaceTile }
