'use client'
import {
    type NormalizedDropdownItemType,
    SearchableDropdown,
} from '@entur/dropdown'
import { Checkbox, Fieldset } from '@entur/form'
import { SearchIcon } from '@entur/icons'
import { Paragraph, SubParagraph } from '@entur/typography'
import { FormError } from 'app/_components/Form/FormError'
import { HiddenInput } from 'app/_components/Form/HiddenInput'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import { useClosestStopPlacesBeta } from 'app/_hooks/useClosestStopPlacesBeta'
import { useCountyFilter } from 'app/_hooks/useCountyFilter'
import useCurrentPosition from 'app/_hooks/useCurrentPosition'
import { useStopPlaceSearch } from 'app/_hooks/useStopPlaceSearch'
import type { StopPlace } from 'app/(innlogget)/utils/fetch'
import { coordinatesToStopPlaceDropdownItem } from 'app/(innlogget)/utils/position'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useActionState, useState } from 'react'
import type { BoardDB } from 'types/db-types/boards'
import { type AddStopPlaceFormState, addStopPlaceTiles } from './actions'
import { FylkeFilter } from './FylkeFilter'

const NUMBER_OF_CLOSEST_STOP_PLACES = 5
const AREA_RADIUS_IN_KM = 20

function AddStopPlaceTile({ board }: { board: BoardDB }) {
    const { counties, selectedCountyIds, toggleCounty } = useCountyFilter()

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(
            selectedCountyIds.length > 0 ? selectedCountyIds : undefined,
        )

    const {
        closestStopPlaceItems,
        allClosestItems,
        isLoading: isLoadingClosestStopPlaces,
        selectedClosestStopPlaces,
        setSelectedClosestStopPlaces,
    } = useClosestStopPlacesBeta(
        selectedStopPlace?.value.type === 'stop_place'
            ? undefined
            : selectedStopPlace?.value.coordinates,
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
            county_count: selectedCountyIds.length,
            typeOfPlace: selectedStopPlace?.value.type ?? 'other',
            selectedIndexes:
                selectedStopPlace?.value.type === 'stop_place'
                    ? []
                    : (selectedClosestStopPlaces?.map((selected) =>
                          closestStopPlaceItems.findIndex(
                              (closestItem) =>
                                  closestItem.value.id === selected.value.id,
                          ),
                      ) ?? []),
        })
        setTimeout(() => {
            capture('survey_settings_beta')
        }, 5000)

        const hasStopPlaces =
            (formData.get('closest_stop_places') ?? '[]') !== '[]'
        if (!hasStopPlaces && !selectedStopPlace) {
            return {
                status: 'error',
                message: 'Du må velge adresse, stoppested eller sted',
                field: 'stop_place',
            }
        }

        const result = await addStopPlaceTiles(
            board.id,
            formData,
            board.isArrivals,
            board.meta.location,
        )

        if (result?.status === 'success') {
            setSelectedStopPlace(null)
            setSelectedClosestStopPlaces(null)
        }

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

    const genericError =
        state?.status === 'error' && !state.field ? state.message : undefined

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
        const typeOfPlace = selectedItem?.value.type
        capture('stop_place_add_interaction', {
            location: 'edit_board_page',
            field: 'stop_place',
            action: selectedItem?.value ? 'selected' : 'cleared',
            typeOfPlace: typeOfPlace ?? 'other',
        })

        if (selectedItem?.value.id === 'current_position') {
            setSelectedClosestStopPlaces(null)
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

        setSelectedStopPlace(selectedItem)

        if (selectedItem && typeOfPlace === 'stop_place') {
            setSelectedClosestStopPlaces([
                {
                    ...selectedItem,
                    value: {
                        ...selectedItem.value,
                        name: selectedItem.label.split(',')[0],
                    },
                },
            ])
        } else {
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

    function toggleClosestStopPlace(
        item: NormalizedDropdownItemType<StopPlace>,
        checked: boolean,
    ) {
        const current = selectedClosestStopPlaces ?? []
        handleClosestStopPlacesChange(
            checked
                ? [...current, item]
                : current.filter(
                      (selected) => selected.value.id !== item.value.id,
                  ),
        )
    }

    const selectedClosestIds = new Set(
        selectedClosestStopPlaces?.map((selected) => selected.value.id),
    )

    const selectedPlaceName =
        selectedStopPlace?.value.id === 'current_position'
            ? 'posisjonen din'
            : selectedStopPlace?.label.split(',')[0]

    const showClosestStopPlaces =
        selectedStopPlace?.value.type !== 'stop_place' &&
        Boolean(selectedStopPlace?.value.coordinates)

    const closestStopPlacesErrorId = 'closest-stop-places-error'

    return (
        <form
            className="mr-6 flex w-full flex-col gap-4 lg:flex-col"
            action={formAction}
        >
            <FylkeFilter
                counties={counties}
                selectedCountyIds={selectedCountyIds}
                onToggleCounty={toggleCounty}
                trackingLocation="edit_board_page"
            />

            <div className="w-full">
                <Paragraph margin="none">
                    Skriv inn adresse, stoppested eller sted
                </Paragraph>
                <SearchableDropdown
                    noMatchesText="Ingen stoppesteder funnet"
                    items={searchStopPlaces}
                    label="Stoppested eller adresse*"
                    clearable
                    prepend={<SearchIcon aria-hidden />}
                    selectedItem={selectedStopPlace}
                    onChange={handlePlaceChange}
                    // Enter skal bare velge stoppested, ikke sende inn skjemaet
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault()
                    }}
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
            <div aria-live="polite">
                {showClosestStopPlaces && (
                    <Fieldset
                        className="flex flex-col gap-2"
                        aria-describedby={
                            !selectedClosestStopPlaces?.length &&
                            closestStopPlacesError
                                ? closestStopPlacesErrorId
                                : undefined
                        }
                    >
                        <legend>
                            <Paragraph as="span" margin="none">
                                Stoppesteder nær {selectedPlaceName}
                            </Paragraph>
                        </legend>
                        <SubParagraph margin="none">
                            Velg hvilke stoppesteder du vil vise på tavla.
                        </SubParagraph>
                        {isLoadingClosestStopPlaces ? (
                            <Paragraph margin="none">
                                Henter stoppesteder i nærheten…
                            </Paragraph>
                        ) : allClosestItems.length === 0 ? (
                            <Paragraph margin="none">
                                Fant ingen stoppesteder i nærheten
                            </Paragraph>
                        ) : (
                            allClosestItems.map((item) => (
                                <div
                                    key={item.value.id}
                                    className="flex w-fullitems-center justify-between gap-2"
                                >
                                    <Checkbox
                                        value={item.value.id}
                                        checked={selectedClosestIds.has(
                                            item.value.id,
                                        )}
                                        onChange={(e) =>
                                            toggleClosestStopPlace(
                                                item,
                                                e.target.checked,
                                            )
                                        }
                                    >
                                        {item.label}
                                    </Checkbox>
                                    <span className="flex gap-1">
                                        {item.icons?.map((Icon) => (
                                            <Icon key={Icon.displayName} />
                                        ))}
                                    </span>
                                </div>
                            ))
                        )}
                        {!selectedClosestStopPlaces?.length && (
                            <div id={closestStopPlacesErrorId}>
                                <FormError
                                    feedback={closestStopPlacesError}
                                    variant="error"
                                />
                            </div>
                        )}
                    </Fieldset>
                )}
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

            <FormError feedback={genericError} variant="error" />
        </form>
    )
}

export { AddStopPlaceTile }
