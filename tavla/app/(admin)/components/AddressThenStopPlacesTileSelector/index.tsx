'use client'
import { Dropdown, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { SubmitButton } from 'app/(admin)/components/Form/SubmitButton'
import { useAddressThenStopPlaces } from 'app/(admin)/hooks/useAddressThenStopPlaces'
import { useQuaySearch } from 'app/(admin)/hooks/useQuaySearch'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import ClientOnly from 'app/components/NoSSR/ClientOnly'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'

/**
 * Alternative tile selector that uses address/POI search followed by
 * selecting from nearby stop places (within 200m radius)
 */
function AddressThenStopPlacesTileSelector({
    action,
    trackingLocation = 'demo_page',
}: {
    action: (data: FormData) => void
    trackingLocation?: 'board_page' | 'demo_page'
}) {
    const {
        pointItems,
        selectedPoint,
        setSelectedPoint,
        stopPlaces,
        selectedStopPlace,
        setSelectedStopPlace,
        loadingStopPlaces,
    } = useAddressThenStopPlaces()

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value.id ?? '',
    )

    const posthog = usePosthogTracking()
    const [state, setFormError] = useState<TFormFeedback | undefined>()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (!selectedStopPlace) {
            event.preventDefault()
            return setFormError(
                getFormFeedbackForError('create/stop_place-missing'),
            )
        }

        posthog.capture('stop_place_added', {
            location: trackingLocation,
            county_selected: false,
            county_count: 0,
            platform_selected: !!selectedQuay,
        })

        setFormError(undefined)
        setSelectedQuay(null)
        setSelectedStopPlace(null)
        setSelectedPoint(null)
        setTimeout(() => {
            posthog.capture('survey_set_up_board')
        }, 5000)
    }

    return (
        <form
            className="mr-6 flex w-full flex-col gap-4 lg:flex-row"
            action={action}
            onSubmit={handleSubmit}
        >
            <div className="w-full">
                <ClientOnly>
                    <SearchableDropdown
                        label="Søk etter adresse eller POI"
                        items={pointItems}
                        selectedItem={selectedPoint}
                        onChange={(e) => {
                            posthog.capture('stop_place_add_interaction', {
                                location: trackingLocation,
                                field: 'stop_place',
                                action: e?.value ? 'selected' : 'cleared',
                            })
                            setSelectedPoint(e)
                        }}
                        debounceTimeout={150}
                        clearable
                        prepend={<SearchIcon aria-hidden />}
                        aria-required
                    />
                </ClientOnly>
            </div>

            {selectedPoint && (
                <div className="w-full">
                    <Dropdown
                        items={stopPlaces}
                        label="Velg stoppested"
                        prepend={<SearchIcon aria-hidden />}
                        selectedItem={selectedStopPlace}
                        onChange={(e) => {
                            posthog.capture('stop_place_add_interaction', {
                                location: trackingLocation,
                                field: 'stop_place',
                                action: e?.value ? 'selected' : 'cleared',
                            })
                            setSelectedStopPlace(e)
                        }}
                        disabled={loadingStopPlaces}
                        {...getFormFeedbackForField('stop_place', state)}
                    />
                    {loadingStopPlaces && (
                        <p className="text-sm text-gray-500">
                            Henter stoppesteder i nærheten...
                        </p>
                    )}
                    {stopPlaces.length === 0 && !loadingStopPlaces && (
                        <p className="text-sm text-orange-500">
                            Ingen stoppesteder funnet innenfor 200m radius
                        </p>
                    )}
                </div>
            )}

            {selectedStopPlace && (
                <div className="w-full">
                    <Dropdown
                        items={quays}
                        label="Plattform/retning"
                        prepend={<SearchIcon aria-hidden />}
                        selectedItem={selectedQuay}
                        onChange={(e) => {
                            posthog.capture('stop_place_add_interaction', {
                                location: trackingLocation,
                                field: 'platform',
                                action: e?.value ? 'selected' : 'cleared',
                            })
                            setSelectedQuay(e)
                        }}
                    />
                </div>
            )}

            <HiddenInput id="stop_place" value={selectedStopPlace?.value.id} />
            <HiddenInput
                id="stop_place_name"
                value={selectedStopPlace?.label.split(' (')[0]}
            />
            <HiddenInput id="quay_name" value={selectedQuay?.label} />
            <HiddenInput id="quay" value={selectedQuay?.value} />
            <HiddenInput id="county" value={selectedStopPlace?.value.county} />

            <SubmitButton variant="secondary">Legg til</SubmitButton>
        </form>
    )
}

export { AddressThenStopPlacesTileSelector }
