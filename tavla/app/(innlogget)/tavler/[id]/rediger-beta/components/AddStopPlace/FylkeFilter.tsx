'use client'
import { ActionChip, FilterChip } from '@entur/chip'
import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { FilterIcon } from '@entur/icons'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'

function FylkeFilter({
    counties,
    selectedCountyIds,
    onToggleCounty,
    onClearAll,
    trackingLocation,
}: {
    counties: NormalizedDropdownItemType[]
    selectedCountyIds: string[]
    onToggleCounty: (id: string) => void
    onClearAll: () => void
    trackingLocation: EventProps<'stop_place_add_interaction'>['location']
}) {
    const { capture } = usePosthogTracking()
    const [isOpen, setIsOpen] = useState(false)

    if (counties.length === 0) return null

    function toggleCounty(countyId: string) {
        const wasSelected = selectedCountyIds.includes(countyId)

        capture('stop_place_add_interaction', {
            location: trackingLocation,
            field: 'county',
            action: wasSelected ? 'cleared' : 'selected',
        })
        onToggleCounty(countyId)

        const isSelectingNewCounty = !wasSelected
        const isRemovingLastCounty =
            wasSelected && selectedCountyIds.length === 1
        if (isSelectingNewCounty || isRemovingLastCounty) {
            setIsOpen(false)
        }
    }

    function clearAll() {
        capture('stop_place_add_interaction', {
            location: trackingLocation,
            field: 'county',
            action: 'cleared',
        })
        onClearAll()
    }

    const selectedCounties = counties.filter((county) =>
        selectedCountyIds.includes(county.value),
    )

    return (
        <div className="flex flex-wrap items-center gap-2">
            <ActionChip
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
            >
                <FilterIcon aria-hidden /> Velg fylker
            </ActionChip>

            {isOpen &&
                counties.map((county) => (
                    <FilterChip
                        key={county.value}
                        name="county"
                        value={county.value}
                        checked={selectedCountyIds.includes(county.value)}
                        onChange={() => toggleCounty(county.value)}
                    >
                        {county.label}
                    </FilterChip>
                ))}

            {!isOpen &&
                selectedCounties.map((county) => (
                    <FilterChip
                        key={county.value}
                        name="county"
                        value={county.value}
                        checked
                        onChange={() => onToggleCounty(county.value)}
                    >
                        {county.label}
                    </FilterChip>
                ))}
        </div>
    )
}

export { FylkeFilter }
