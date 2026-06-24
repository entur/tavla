'use client'
import { SearchableDropdown } from '@entur/dropdown'
import { Paragraph } from '@entur/typography'
import { HiddenInput } from 'app/_components/Form/HiddenInput'
import ClientOnly from 'app/_components/NoSSR/ClientOnly'
import { usePointSearch } from 'app/_hooks/usePointSearch'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useEffect, useRef } from 'react'
import type { LocationDB } from 'types/db-types/boards'

function WalkingDistance({
    location,
    onChange,
}: {
    location?: LocationDB
    onChange: () => void
}) {
    const { capture } = usePosthogTracking()

    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)

    const isFirstRender = useRef(true)

    //Wait until selectedPoint is set before calling onChange to ensure the form is updated correctly
    // biome-ignore lint/correctness/useExhaustiveDependencies: selectedPoint triggers onChange intentionally
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        onChange()
    }, [onChange, selectedPoint])

    return (
        <div className="flex flex-col">
            <Paragraph margin="none">
                <b>Hvor befinner tavla seg:</b>
            </Paragraph>
            <Paragraph className="mb-2">
                Skriv inn hvor tavla befinner seg for å vise gangavstand til
                stoppestedet.
            </Paragraph>
            <ClientOnly>
                <SearchableDropdown
                    label="Hvor befinner tavla seg?"
                    items={pointItems}
                    selectedItem={selectedPoint}
                    onChange={(e) => {
                        capture('board_settings_changed', {
                            setting: 'board_location',
                            value: 'changed',
                        })
                        setSelectedPoint(e)
                    }}
                    debounceTimeout={150}
                    clearable
                />
            </ClientOnly>
            <HiddenInput
                id="newLocation"
                value={
                    selectedPoint?.value
                        ? JSON.stringify(selectedPoint.value)
                        : ''
                }
            />
        </div>
    )
}

export { WalkingDistance }
