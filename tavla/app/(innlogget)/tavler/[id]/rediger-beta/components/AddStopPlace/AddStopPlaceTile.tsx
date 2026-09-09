'use client'
import {
    MultiSelect,
    type NormalizedDropdownItemType,
    SearchableDropdown,
} from '@entur/dropdown'
import { FeedbackText } from '@entur/form'
import { SearchIcon } from '@entur/icons'
import { Paragraph } from '@entur/typography'
import { HiddenInput } from 'app/_components/Form/HiddenInput'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import { useClosestStopPlaces } from 'app/_hooks/useClosestStopPlaces'
import useCurrentPosition from 'app/_hooks/useCurrentPosition'
import { useStopPlaceSearch } from 'app/_hooks/useStopPlaceSearch'
import type { StopPlace } from 'app/(innlogget)/utils/fetch'
import { coordinatesToStopPlaceDropdownItem } from 'app/(innlogget)/utils/position'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useActionState, useState } from 'react'
import type { BoardDB } from 'types/db-types/boards'
import { type AddStopPlaceFormState, addStopPlaceTiles } from './actions'

const NUMBER_OF_CLOSEST_STOP_PLACES = 10
const AREA_RADIUS_IN_KM = 20

function AddStopPlaceTile({
    board,
    trackingLocation,
}: {
    board: BoardDB
    trackingLocation: EventProps<'stop_place_add_interaction'>['location']
}) {
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

    const { fetchPosition, currentPositionState } = useCurrentPosition()

    const { capture } = usePosthogTracking()

    const [positionError, setPositionError] = useState<string | undefined>()

    async function handleAddStopPlaces(
        _prevState: AddStopPlaceFormState,
        formData: FormData,
    ): Promise<AddStopPlaceFormState> {
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

        return result
    }

    const [state, formAction, isPending] = useActionState(
        handleAddStopPlaces,
        null,
    )

    const stopPlaceError =
        state?.status === 'error' &&
        state.field === 'stop_place' &&
        !selectedStopPlace
            ? state.message
            : undefined

    const closestStopPlacesError =
        state?.status === 'error' &&
        state.field === 'closest_stop_places' &&
        !selectedClosestStopPlaces?.length
            ? state.message
            : undefined

    const generalError =
        (state?.status === 'error' && !state.field
            ? state.message
            : undefined) ?? positionError

    async function searchStopPlaces(search: string) {
        const stopPlaces = await stopPlaceItems(
            search || selectedStopPlace?.label.split(',')[0] || '',
        )
        return [
            search === '' ? coordinatesToStopPlaceDropdownItem() : null,
            ...stopPlaces,
        ].filter(Boolean) as NormalizedDropdownItemType<StopPlace>[]
    }

    function handleStopPlaceChange(
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
                } else if (currentPositionState?.type === 'error') {
                    setSelectedStopPlace(null)
                    setPositionError('Kunne ikke hente posisjonen din')
                }
            })
            return
        }

        const typeOfPlace = selectedItem?.value.type

        capture('stop_place_add_interaction', {
            location: trackingLocation,
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
                    onChange={handleStopPlaceChange}
                    debounceTimeout={200}
                    aria-required
                    variant={stopPlaceError ? 'negative' : undefined}
                    feedback={stopPlaceError}
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
                    onChange={(selectedItems) => {
                        const addedStopPlace =
                            selectedItems.length >
                            (selectedClosestStopPlaces?.length ?? 0)
                        capture('stop_place_add_interaction', {
                            location: trackingLocation,
                            field: 'closest_stop_places',
                            action: addedStopPlace ? 'added' : 'removed',
                            typeOfPlace:
                                selectedStopPlace?.value.type ?? 'other',
                            selectedIndexes: selectedItems.map((selectedItem) =>
                                closestStopPlaceItems.findIndex(
                                    (closestItem) =>
                                        closestItem.value.id ===
                                        selectedItem.value.id,
                                ),
                            ),
                        })
                        setSelectedClosestStopPlaces(selectedItems)
                    }}
                    variant={closestStopPlacesError ? 'negative' : undefined}
                    feedback={closestStopPlacesError}
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

            {generalError && (
                <FeedbackText variant="negative">{generalError}</FeedbackText>
            )}

            <SubmitButton
                variant="primary"
                className="w-full"
                disabled={isPending}
                onClick={() =>
                    capture('stop_place_added', {
                        location: trackingLocation,
                        county_count: 0 /* Midlertidig satt til 0 da dette feltet er obligatorisk */,
                        typeOfPlace: selectedStopPlace?.value.type ?? 'other',
                        selectedIndexes:
                            selectedClosestStopPlaces?.map((selected) =>
                                closestStopPlaceItems.findIndex(
                                    (closestItem) =>
                                        closestItem.value.id ===
                                        selected.value.id,
                                ),
                            ) ?? [],
                    })
                }
            >
                Legg til stoppesteder
            </SubmitButton>
        </form>
    )
}

export { AddStopPlaceTile }
