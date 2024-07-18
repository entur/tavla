'use client'
import { Dropdown, MultiSelect, SearchableDropdown } from '@entur/dropdown'
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

function TileSelector({
    action,
    oid,
    showLabel,
    col = true,
    lineIcons = true,
}: {
    action: (data: FormData) => void
    oid?: TOrganizationID
    showLabel?: boolean
    col?: boolean
    lineIcons?: boolean
}) {
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch(oid)

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value ?? '',
        lineIcons,
    )

    const classname = col ? '' : 'lg:flex-row'

    const [state, setFormError] = useState<TFormFeedback | undefined>()
    return (
        <form
            className={`flex flex-col ${classname} gap-4 mr-6 w-full`}
            action={action}
            onSubmit={(event) => {
                if (!selectedStopPlace || !selectedQuay) {
                    event.preventDefault()
                    return setFormError(
                        getFormFeedbackForError(
                            !selectedStopPlace
                                ? 'create/stop_place-missing'
                                : 'create/quay-missing',
                        ),
                    )
                }
                setFormError(undefined)
                setSelectedQuay(null)
                setSelectedStopPlace(null)
            }}
        >
            <div className="w-full">
                {showLabel && <Label>Velg fylke</Label>}
                <MultiSelect
                    label="Fylker (valgfritt)"
                    items={counties}
                    selectedItems={selectedCounties}
                    onChange={setSelectedCounties}
                    prepend={<SearchIcon />}
                    maxChips={2}
                    hideSelectAll
                />
            </div>
            <div className="w-full">
                {showLabel && <Label>Søk etter stoppested</Label>}
                <SearchableDropdown
                    items={stopPlaceItems}
                    label="Stoppested"
                    clearable
                    prepend={<SearchIcon />}
                    selectedItem={selectedStopPlace}
                    onChange={setSelectedStopPlace}
                    debounceTimeout={1000}
                    {...getFormFeedbackForField('stop_place', state)}
                />
            </div>
            <div className="w-full">
                {showLabel && <Label>Velg stoppestedets retning</Label>}
                <Dropdown
                    items={quays}
                    label="Plattform/retning"
                    clearable
                    prepend={<SearchIcon />}
                    selectedItem={selectedQuay}
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
            <HiddenInput id="quay" value={selectedQuay?.value} />

            <SubmitButton variant="primary">Legg til</SubmitButton>
        </form>
    )
}

export { TileSelector }
