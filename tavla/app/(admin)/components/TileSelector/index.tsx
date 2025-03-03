'use client'
import {
    Dropdown,
    MultiSelect,
    NormalizedDropdownItemType,
    SearchableDropdown,
} from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { useStopPlaceSearch } from 'app/(admin)/hooks/useStopPlaceSearch'
import { useQuaySearch } from 'app/(admin)/hooks/useQuaySearch'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TOrganizationID } from 'types/settings'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { useState } from 'react'
import { Label } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { usePostHog } from 'posthog-js/react'

function TileSelector({
    action,
    oid,
}: {
    action: (data: FormData) => void
    oid?: TOrganizationID
}) {
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch(oid)

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value ?? '',
    )

    const posthog = usePostHog()

    const [state, setFormError] = useState<TFormFeedback | undefined>()
    return (
        <form
            className="flex flex-col lg:flex-row gap-4 mr-6 w-full"
            action={action}
            onSubmit={(event) => {
                if (!selectedStopPlace) {
                    event.preventDefault()
                    return setFormError(
                        getFormFeedbackForError(
                            !selectedStopPlace
                                ? 'create/stop_place-missing'
                                : 'create/quay-missing',
                        ),
                    )
                }
                posthog.capture('ADD_TILE_TO_BOARD')
                setFormError(undefined)
                setSelectedQuay(null)
                setSelectedStopPlace(null)
            }}
        >
            <div className="w-full">
                <Label>Velg fylke</Label>
                <MultiSelect
                    label="Fylker (valgfritt)"
                    items={counties}
                    selectedItems={selectedCounties}
                    onChange={setSelectedCounties}
                    prepend={<SearchIcon aria-hidden />}
                    maxChips={2}
                    hideSelectAll
                />
            </div>
            <div className="w-full">
                <Label>Søk etter stoppested</Label>
                <SearchableDropdown
                    items={stopPlaceItems}
                    label="Stoppested"
                    clearable
                    prepend={<SearchIcon aria-hidden />}
                    selectedItem={selectedStopPlace}
                    onChange={setSelectedStopPlace}
                    debounceTimeout={150}
                    {...getFormFeedbackForField('stop_place', state)}
                />
            </div>
            <div className="w-full">
                <Label>Velg stoppestedets retning</Label>
                <Dropdown
                    items={quays}
                    label="Plattform/retning"
                    clearable
                    prepend={<SearchIcon aria-hidden />}
                    selectedItem={
                        selectedQuay ??
                        ({
                            value: selectedStopPlace?.value,
                            label: 'Vis alle',
                        } as NormalizedDropdownItemType)
                    }
                    onChange={setSelectedQuay}
                    disabled={!selectedStopPlace}
                    {...getFormFeedbackForField('quay', state)}
                />
            </div>
            <HiddenInput id="stop_place" value={selectedStopPlace?.value} />
            <HiddenInput
                id="stop_place_name"
                value={selectedStopPlace?.label}
            />
            <HiddenInput id="quay_name" value={selectedQuay?.label} />
            <HiddenInput id="quay" value={selectedQuay?.value} />

            <SubmitButton variant="primary">Legg til</SubmitButton>
        </form>
    )
}

export { TileSelector }
