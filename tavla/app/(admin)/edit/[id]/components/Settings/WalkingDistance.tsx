'use client'
import { SearchableDropdown } from '@entur/dropdown'
import { Heading4, Paragraph } from '@entur/typography'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TLocation } from 'types/meta'
function WalkingDistance({ location }: { location?: TLocation }) {
    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)

    return (
        <div className="flex flex-col">
            <Heading4 margin="bottom">Gangavstand</Heading4>
            <Paragraph className="mb-2">
                Vis gangavstand fra tavlens adresse til stoppestedet.
            </Paragraph>
            <SearchableDropdown
                label="Hvor befinner tavlen seg?"
                items={pointItems}
                selectedItem={selectedPoint}
                onChange={setSelectedPoint}
                debounceTimeout={150}
                clearable
            />
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
