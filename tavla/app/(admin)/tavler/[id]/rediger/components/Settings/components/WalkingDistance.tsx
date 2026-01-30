'use client'
import { SearchableDropdown } from '@entur/dropdown'
import { Heading4, Paragraph } from '@entur/typography'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import ClientOnly from 'app/components/NoSSR/ClientOnly'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useEffect, useRef } from 'react'
import { LocationDB } from 'src/types/db-types/boards'

function WalkingDistance({
    location,
    onChange,
}: {
    location?: LocationDB
    onChange: () => void
}) {
    const posthog = usePosthogTracking()

    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)

    const isFirstRender = useRef(true)

    //Wait until selectedPoint is set before calling onChange to ensure the form is updated correctly
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        onChange()
    }, [selectedPoint, onChange])

    return (
        <div className="flex flex-col">
            <Heading4 margin="bottom">Gangavstand</Heading4>
            <Paragraph className="mb-2">
                Skriv inn hvor tavlen befinner seg for å vise gangavstand til
                stoppestedet.
            </Paragraph>
            <ClientOnly>
                <SearchableDropdown
                    label="Hvor befinner tavlen seg?"
                    items={pointItems}
                    selectedItem={selectedPoint}
                    onChange={(e) => {
                        posthog.capture('board_settings_changed', {
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
