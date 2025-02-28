'use client'
import { NormalizedDropdownItemType, SearchableDropdown } from '@entur/dropdown'
import { Heading4, Paragraph } from '@entur/typography'
import { Dispatch, SetStateAction } from 'react'
import { TLocation } from 'types/meta'
function WalkingDistance({
    pointItems,
    selectedPoint,
    setSelectedPoint,
}: {
    pointItems: (
        search: string,
    ) => Promise<NormalizedDropdownItemType<TLocation>[]>
    selectedPoint: NormalizedDropdownItemType<TLocation> | null
    setSelectedPoint: Dispatch<
        SetStateAction<NormalizedDropdownItemType<TLocation> | null>
    >
}) {
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
        </div>
    )
}

export { WalkingDistance }
