'use client'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { Heading4, Paragraph } from '@entur/typography'
import dynamic from 'next/dynamic'
import { Dispatch, ReactElement, SetStateAction } from 'react'
import { TLocation } from 'types/meta'

const SearchableDropdown = dynamic(
    () => import('@entur/dropdown').then((mod) => mod.SearchableDropdown),
    { ssr: false },
)
function WalkingDistance({
    pointItems,
    selectedPoint,
    setSelectedPoint,
    error,
}: {
    pointItems: (
        search: string,
    ) => Promise<NormalizedDropdownItemType<TLocation>[]>
    selectedPoint: NormalizedDropdownItemType<TLocation | unknown> | null
    setSelectedPoint: Dispatch<
        SetStateAction<NormalizedDropdownItemType<TLocation | unknown> | null>
    >
    error?: ReactElement
}) {
    return (
        <div className="flex flex-col">
            <Heading4 margin="bottom">Gangavstand</Heading4>
            <Paragraph className="mb-2">
                Vis gåavstanden fra tavlens adresse til stoppestedet.
            </Paragraph>

            <SearchableDropdown
                label="Hvor befinner tavlen seg?"
                items={pointItems}
                selectedItem={selectedPoint}
                onChange={setSelectedPoint}
                debounceTimeout={150}
                clearable
            />
            <div className="mt-4">{error}</div>
        </div>
    )
}

export { WalkingDistance }
