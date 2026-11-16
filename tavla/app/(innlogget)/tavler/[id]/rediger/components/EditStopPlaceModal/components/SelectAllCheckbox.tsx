'use client'
import { Checkbox } from '@entur/form'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'

export function SelectAllCheckbox({
    checked,
    onChange,
    trackingLocation,
    trackingField,
}: {
    checked: boolean | 'indeterminate'
    onChange: (selectAll: boolean) => void
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    trackingField: EventProps<'stop_place_edit_interaction'>['field']
}) {
    const { capture } = usePosthogTracking()

    const handleChange = (selectAll: boolean) => {
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: trackingField,
            column_value: 'none',
            action: selectAll ? 'select_all_groups' : 'cleared_groups',
        })
        onChange(selectAll)
    }

    return (
        <Checkbox
            className="mt-0 mb-2"
            checked={checked}
            onChange={(e) => handleChange(e.target.checked)}
        >
            Velg alle
        </Checkbox>
    )
}
