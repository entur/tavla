'use client'
import { MultiSelect, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { SubmitButton } from 'app/(admin)/components/Form/SubmitButton'
import { useClosestStopPlaceSearch } from 'app/(admin)/hooks/useClosestStopPlaceSearch'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { useMainStopPlaceItem } from 'app/(admin)/hooks/useMainStopPlaceItem'
import { useStopPlaceSearch } from 'app/(admin)/hooks/useStopPlaceSearch'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'

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
        selectedClosestStopPlaces,
        setSelectedClosestStopPlaces,
    } = useClosestStopPlaceSearch(
        selectedStopPlace?.value.coordinates
            ? [
                  selectedStopPlace.value.coordinates[1],
                  selectedStopPlace.value.coordinates[0],
              ]
            : [0, 0],
        NUMBER_OF_CLOSEST_STOP_PLACES,
        AREA_RADIUS_IN_KM,
    )

    const { setMainStopPlaceItem, allClosestItems } = useMainStopPlaceItem(
        closestStopPlaceItems,
        selectedStopPlace?.value.coordinates,
        setSelectedClosestStopPlaces,
    )

    const posthog = usePosthogTracking()

    const [state, setFormError] = useState<TFormFeedback | undefined>()

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
                    items={(search) =>
                        stopPlaceItems(
                            search ||
                                selectedStopPlace?.label.split(',')[0] ||
                                '',
                        )
                    }
                    label="Stoppested, adresse eller sted*"
                    clearable
                    prepend={<SearchIcon aria-hidden />}
                    selectedItem={selectedStopPlace}
                    onChange={(e) => {
                        const typeOfPlace = (() => {
                            if (e?.value.layer === 'venue') {
                                if (e.value.category?.includes('vegadresse'))
                                    return 'address'
                                return 'stop_place'
                            }
                            return 'other'
                        })()
                        posthog.capture('stop_place_add_interaction', {
                            location: trackingLocation,
                            field: 'stop_place',
                            action: e?.value ? 'selected' : 'cleared',
                            typeOfPlace,
                        })
                        setSelectedStopPlace(e)
                        if (e) {
                            const isStopPlace = e.value.layer === 'venue'
                            const item = {
                                value: {
                                    id: e.value.id,
                                    county: e.value.county,
                                },
                                label: e.label,
                            }
                            if (isStopPlace) {
                                setMainStopPlaceItem(item)
                                setSelectedClosestStopPlaces([item])
                            } else {
                                setMainStopPlaceItem(null)
                                setSelectedClosestStopPlaces(null)
                            }
                        } else {
                            setMainStopPlaceItem(null)
                            setSelectedClosestStopPlaces(null)
                        }
                    }}
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
                    onChange={(e) => {
                        posthog.capture('stop_place_add_interaction', {
                            location: trackingLocation,
                            field: 'closest_stop_places',
                            action: e.length > 0 ? 'selected' : 'cleared',
                            typeOfPlace: 'stop_place',
                        })
                        setSelectedClosestStopPlaces(e)
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

            <SubmitButton variant="secondary">Legg til</SubmitButton>
        </form>
    )
}

export { TileSelector }
