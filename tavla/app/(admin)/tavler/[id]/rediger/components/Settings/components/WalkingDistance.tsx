'use client'
import { SearchableDropdown } from '@entur/dropdown'
import { Heading4, Paragraph } from '@entur/typography'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import ClientOnly from 'app/components/NoSSR/ClientOnly'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useEffect, useRef } from 'react'
import { TLocation } from 'types/meta'

function WalkingDistance({
    location,
    onChange,
}: {
    location?: TLocation
    onChange: () => void
}) {
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
                    onChange={setSelectedPoint}
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
