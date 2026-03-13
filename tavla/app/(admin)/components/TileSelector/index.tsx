'use client'
import {
    MultiSelect,
    NormalizedDropdownItemType,
    SearchableDropdown,
} from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { SubmitButton } from 'app/(admin)/components/Form/SubmitButton'
import { useClosestStopPlaces } from 'app/(admin)/hooks/useClosestStopPlaces'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import useCurrentPosition from 'app/(admin)/hooks/useCurrentPosition'
import { useStopPlaceSearch } from 'app/(admin)/hooks/useStopPlaceSearch'
import {
    getFormFeedbackForError,
    getFormFeedbackForField,
    TFormFeedback,
} from 'app/(admin)/utils'
import { StopPlace } from 'app/(admin)/utils/fetch'
import { coordinatesToStopPlaceDropdownItem } from 'app/(admin)/utils/position'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { getTypeOfPlace } from './utils'

const NUMBER_OF_CLOSEST_STOP_PLACES = 10
const AREA_RADIUS_IN_KM = 20

function TileSelector({
    action,
    trackingLocation,
}: {
    action: (data: FormData) => void
    folderid?: FolderDB['id']
    trackingLocation: EventProps<'stop_place_add_interaction'>['location']
}) {
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch()

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

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

    const posthog = usePosthogTracking()

    const [state, setFormError] = useState<TFormFeedback | undefined>()

    async function searchStopPlaces(search: string) {
        const stopPlaces = await stopPlaceItems(
            search || selectedStopPlace?.label.split(',')[0] || '',
        )
        return [
            search == '' ? coordinatesToStopPlaceDropdownItem() : null,
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
                    setFormError(
                        getFormFeedbackForError('create/position-failed'),
                    )
                }
            })
            return
        }

        const typeOfPlace = getTypeOfPlace(selectedItem)

        posthog.capture('stop_place_add_interaction', {
            location: trackingLocation,
            field: 'stop_place',
            action: selectedItem?.value ? 'selected' : 'cleared',
            typeOfPlace,
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
            className="mr-6 flex w-full flex-col gap-4 lg:flex-row"
            action={action}
            onSubmit={() => {
                if (!selectedStopPlace) {
                    return setFormError(
                        getFormFeedbackForError('create/stop_place-missing'),
                    )
                }

                if (
                    !selectedClosestStopPlaces ||
                    selectedClosestStopPlaces.length === 0
                ) {
                    return setFormError(
                        getFormFeedbackForError(
                            'create/closest_stop_places-missing',
                        ),
                    )
                }

                setFormError(undefined)
                setSelectedClosestStopPlaces(null)
                setMainStopPlaceItem(null)
                setTimeout(() => {
                    if (trackingLocation !== 'demo_page') {
                        posthog.capture('survey_set_up_board')
                    }
                }, 5000)
            }}
        >
            <div className="w-full">
                <MultiSelect
                    label="Fylker"
                    items={counties}
                    selectedItems={selectedCounties}
                    onChange={(e) => {
                        posthog.capture('stop_place_add_interaction', {
                            location: trackingLocation,
                            field: 'county',
                            action:
                                e.length > selectedCounties.length
                                    ? 'selected'
                                    : 'cleared',
                        })
                        setSelectedCounties(e)
                    }}
                    clearInputOnSelect={true}
                    prepend={<SearchIcon aria-hidden />}
                    maxChips={2}
                    hideSelectAll
                />
            </div>
            <div className="w-full">
                <SearchableDropdown
                    noMatchesText="Ingen stoppesteder funnet"
                    items={searchStopPlaces}
                    label="Stoppested, adresse eller sted*"
                    clearable
                    prepend={<SearchIcon aria-hidden />}
                    selectedItem={selectedStopPlace}
                    onChange={handleStopPlaceChange}
                    debounceTimeout={200}
                    aria-required
                    {...getFormFeedbackForField('stop_place', state)}
                />
            </div>
            <div className="w-full">
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
                        posthog.capture('stop_place_add_interaction', {
                            location: trackingLocation,
                            field: 'closest_stop_places',
                            action: addedStopPlace ? 'added' : 'removed',
                            typeOfPlace: getTypeOfPlace(selectedStopPlace),
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
                    {...getFormFeedbackForField('closest_stop_places', state)}
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
                variant="secondary"
                onClick={() =>
                    posthog.capture('stop_place_added', {
                        location: trackingLocation,
                        county_count: selectedCounties.length,
                        typeOfPlace: getTypeOfPlace(selectedStopPlace),
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
                Legg til
            </SubmitButton>
        </form>
    )
}

export { TileSelector }
