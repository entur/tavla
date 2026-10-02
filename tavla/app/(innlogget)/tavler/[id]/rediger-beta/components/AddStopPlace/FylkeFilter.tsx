'use client'
import { ActionChip, FilterChip } from '@entur/chip'
import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { FilterIcon } from '@entur/icons'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'

function FylkeFilter({
    counties,
    selectedCountyId,
    onSelectCounty,
    onClearSelection,
    trackingLocation,
}: {
    counties: NormalizedDropdownItemType[]
    selectedCountyId: string | null
    onSelectCounty: (id: string) => void
    onClearSelection: () => void
    trackingLocation: EventProps<'stop_place_add_interaction'>['location']
}) {
    const { capture } = usePosthogTracking()
    const [isOpen, setIsOpen] = useState(false)

    if (counties.length === 0) return null

    function selectCounty(countyId: string) {
        capture('stop_place_add_interaction', {
            location: trackingLocation,
            field: 'county',
            action: 'selected',
        })
        onSelectCounty(countyId)
        setIsOpen(false)
    }

    function clearSelection() {
        capture('stop_place_add_interaction', {
            location: trackingLocation,
            field: 'county',
            action: 'cleared',
        })
        onClearSelection()
    }

    const selectedCounty = counties.find(
        (county) => county.value === selectedCountyId,
    )

    return (
        <div className="flex flex-wrap items-center gap-2 mt-2">
            <ActionChip
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
            >
                <FilterIcon aria-hidden /> Velg fylke
            </ActionChip>

            {isOpen &&
                counties.map((county) => (
                    <FilterChip
                        key={county.value}
                        name="county"
                        value={county.value}
                        checked={county.value === selectedCountyId}
                        onChange={(e) =>
                            e.target.checked
                                ? selectCounty(county.value)
                                : clearSelection()
                        }
                    >
                        {county.label}
                    </FilterChip>
                ))}

            {!isOpen && selectedCounty && (
                <FilterChip
                    name="county"
                    value={selectedCounty.value}
                    checked
                    onChange={clearSelection}
                >
                    {selectedCounty.label}
                </FilterChip>
            )}
        </div>
    )
}

export { FylkeFilter }
