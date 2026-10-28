import { FilterChip } from '@entur/chip'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'

import type { FilterMode } from './SetFilter'

const filterModes: { value: FilterMode; textValue: string }[] = [
    {
        value: 'stopPlaceFilter',
        textValue: 'Hele stoppestedet',
    },
    {
        value: 'quaysFilter',
        textValue: 'Én eller flere plattformer',
    },
] as const

export function SetFilterMode({
    selectedFilterMode,
    trackingLocation,
    onFieldChanged,
}: {
    selectedFilterMode: (typeof filterModes)[number]['value']
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: FilterMode) => void
}) {
    const { capture } = usePosthogTracking()

    const handleChange = (mode: (typeof filterModes)[number]['value']) => {
        // TODO - Posthog tracking for filter mode change
        onFieldChanged(mode)
    }

    return (
        <div className="flex gap-2 mt-2">
            {filterModes.map((mode) => (
                <FilterChip
                    checked={mode.value === selectedFilterMode}
                    key={mode.value}
                    value={mode.value}
                    onChange={() => handleChange(mode.value)}
                >
                    {mode.textValue}
                </FilterChip>
            ))}
        </div>
    )
}
