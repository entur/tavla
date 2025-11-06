'use client'
import {
    Dropdown,
    MultiSelect,
    NormalizedDropdownItemType,
    SearchableDropdown,
} from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { useQuaySearch } from 'app/(admin)/hooks/useQuaySearch'
import { useStopPlaceSearch } from 'app/(admin)/hooks/useStopPlaceSearch'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { usePostHog } from 'posthog-js/react'
import { useState } from 'react'
import { FolderDB } from 'types/db-types/folders'

function TileSelector({
    action,
}: {
    action: (data: FormData) => void
    folderid?: FolderDB['id']
}) {
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch()

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value ?? '',
    )

    const posthog = usePostHog()

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
                <MultiSelect
                    label="Fylker (valgfritt)"
                    items={counties}
                    selectedItems={selectedCounties}
                    onChange={handleCountyChange}
                    clearInputOnSelect={true}
                    prepend={<SearchIcon aria-hidden />}
                    maxChips={2}
                    hideSelectAll
                />
            </div>
            <div className="w-full">
                <SearchableDropdown
                    items={(search) =>
                        stopPlaceItems(
                            search ||
                                selectedStopPlace?.label.split(',')[0] ||
                                '',
                        )
                    }
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
                <Dropdown
                    items={quays}
                    label="Plattform/retning"
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
            <HiddenInput id="county" value={selectedStopPlace?.county} />

            <SubmitButton variant="secondary">Legg til</SubmitButton>
        </form>
    )
}

export { TileSelector }
