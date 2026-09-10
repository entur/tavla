'use client'
import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { SearchableDropdown } from '@entur/dropdown'
import { Label, Paragraph } from '@entur/typography'
import ClientOnly from 'app/_components/NoSSR/ClientOnly'
import { usePointSearch } from 'app/_hooks/usePointSearch'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState } from 'react'
import type { LocationDB } from 'src/types/db-types/boards'
import { type FormState, saveWalkingDistance } from './action'

export function WalkingDistanceForm({
    bid,
    location,
}: {
    bid: string
    location?: LocationDB
}) {
    const { capture } = usePosthogTracking()

    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)

    async function handleSave(
        _prevState: FormState,
        value: LocationDB | undefined,
    ) {
        const result = await saveWalkingDistance(bid, value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                setting: 'board_location',
                value: 'changed',
            })
        }

        return result
    }

    const [state, action] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    function handleChange(item: NormalizedDropdownItemType<LocationDB> | null) {
        setSelectedPoint(item)
        startTransition(() => {
            action(item?.value)
        })
    }

    return (
        <div className="flex flex-col">
            <Paragraph className="mb-2">Gangavstand</Paragraph>
            <Label>
                Skriv inn hvor tavlen står for å vise avstand til stoppestedet.
            </Label>
            <ClientOnly>
                <SearchableDropdown
                    label="Hvor befinner tavlen seg?"
                    items={pointItems}
                    selectedItem={selectedPoint}
                    onChange={handleChange}
                    debounceTimeout={150}
                    noMatchesText="Skriv inn sted, adresse eller stoppested"
                    clearable
                    variant={error ? 'negative' : undefined}
                    feedback={error}
                />
            </ClientOnly>
        </div>
    )
}
