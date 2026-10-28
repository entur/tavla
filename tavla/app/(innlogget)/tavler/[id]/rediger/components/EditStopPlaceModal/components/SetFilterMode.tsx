import { RadioGroup, RadioPanel } from '@entur/form'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { FilterMode } from './SetFilter'

const filterModes: { value: FilterMode; title: string; description: string }[] =
    [
        {
            value: 'stopPlaceFilter',
            title: 'Hele stoppestedet',
            description:
                'Passer fint hvis du skal vise alle linjer fra et helt stoppested',
        },
        {
            value: 'quaysFilter',
            title: 'Én eller flere plattformer',
            description:
                'Passer fint hvis du skal vise alle linjer fra en plattform, eller en linjer i en retning',
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
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: 'filter_mode',
            action: 'changed',
            column_value: 'none',
        })
        onFieldChanged(mode)
    }

    return (
        <RadioGroup
            value={selectedFilterMode}
            onChange={(e) => handleChange(e.target.value as FilterMode)}
            name={'filterMode'}
        >
            <div className="grid grid-cols-2 gap-4">
                {filterModes.map((mode) => (
                    <RadioPanel
                        key={mode.value}
                        value={mode.value}
                        title={mode.title}
                    >
                        <p className="text-sm">{mode.description}</p>
                    </RadioPanel>
                ))}
            </div>
        </RadioGroup>
    )
}
