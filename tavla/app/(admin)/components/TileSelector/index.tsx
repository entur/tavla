'use client'
import {
    MultiSelect,
    NormalizedDropdownItemType,
    SearchableDropdown,
} from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { SubmitButton } from 'app/(admin)/components/Form/SubmitButton'
import { useClosestStopPlaceSearch } from 'app/(admin)/hooks/useClosestStopPlaceSearch'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { useStopPlaceSearch } from 'app/(admin)/hooks/useStopPlaceSearch'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { stopPlace } from 'app/(admin)/utils/fetch'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useEffect, useMemo, useState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { formatDistance, haversineDistance } from './utils'

const NUMBER_OF_CLOSEST_STOP_PLACES = 5

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

    const [mainStopPlaceItem, setMainStopPlaceItem] =
        useState<NormalizedDropdownItemType<stopPlace> | null>(null)

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
    )

    useEffect(() => {
        if (!mainStopPlaceItem) return
        const matchingItem = closestStopPlaceItems.find(
            (item) => item.value.id === mainStopPlaceItem.value.id,
        )
        if (matchingItem) {
            setMainStopPlaceItem(matchingItem)
            setSelectedClosestStopPlaces((prev) => {
                if (!prev) return [matchingItem]
                return prev.map((p) =>
                    p.value.id === matchingItem.value.id ? matchingItem : p,
                )
            })
        }
    }, [closestStopPlaceItems, mainStopPlaceItem, setSelectedClosestStopPlaces])

    const allClosestItems = useMemo(() => {
        const mainCoords = selectedStopPlace?.value.coordinates
        const itemsWithDistance = closestStopPlaceItems.map((item) => {
            if (!mainCoords || !item.value.coordinates) return item
            const dist = haversineDistance(mainCoords, item.value.coordinates)
            return {
                ...item,
                label: `${item.label} (${formatDistance(dist)})`,
            }
        })

        if (!mainStopPlaceItem) return itemsWithDistance
        const alreadyIncluded = itemsWithDistance.some(
            (item) => item.value.id === mainStopPlaceItem.value.id,
        )
        return alreadyIncluded
            ? itemsWithDistance
            : [mainStopPlaceItem, ...itemsWithDistance]
    }, [mainStopPlaceItem, closestStopPlaceItems, selectedStopPlace])

    const posthog = usePosthogTracking()

    const [state, setFormError] = useState<TFormFeedback | undefined>()

    const handleCountyChange = (
        newSelectedCounties: typeof selectedCounties,
    ) => {
        setSelectedCounties(newSelectedCounties)
    }

    return (
        <form
            className="mr-6 flex w-full flex-col gap-4 lg:flex-row"
            action={action}
            onSubmit={() => {
                if (
                    !selectedClosestStopPlaces ||
                    selectedClosestStopPlaces.length === 0
                ) {
                    return setFormError(
                        getFormFeedbackForError('create/stop_place-missing'),
                    )
                }

                setFormError(undefined)
                setSelectedClosestStopPlaces(null)
                setMainStopPlaceItem(null)
                setTimeout(() => {
                    posthog.capture('survey_set_up_board')
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
                        handleCountyChange(e)
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
                        posthog.capture('stop_place_add_interaction', {
                            location: trackingLocation,
                            field: 'stop_place',
                            action: e?.value ? 'selected' : 'cleared',
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
                            field: 'platform',
                            action: e.length > 0 ? 'selected' : 'cleared',
                        })
                        setSelectedClosestStopPlaces(e)
                    }}
                    {...getFormFeedbackForField('quay', state)}
                />
            </div>
            <HiddenInput
                id="closest_stop_places"
                value={JSON.stringify(
                    (selectedClosestStopPlaces ?? []).map((sp) => ({
                        id: sp.value.id,
                        name: sp.label,
                        county: sp.value.county,
                    })),
                )}
            />

            <SubmitButton variant="secondary">Legg til</SubmitButton>
        </form>
    )
}

export { TileSelector }
