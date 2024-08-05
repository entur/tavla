import {
    NormalizedDropdownItemType,
    PotentiallyAsyncDropdownItemType,
    SearchableDropdown,
} from '@entur/dropdown'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { Tooltip } from 'app/(admin)/components/Tooltip'
import { Dispatch, SetStateAction } from 'react'
import { TLocation } from 'types/meta'

function Address({
    pointItems,
    selectedPoint,
    setSelectedPoint,
}: {
    pointItems: PotentiallyAsyncDropdownItemType<TLocation>
    selectedPoint: NormalizedDropdownItemType<TLocation> | null
    setSelectedPoint: Dispatch<
        SetStateAction<NormalizedDropdownItemType<TLocation> | null>
    >
}) {
    return (
        <div className="box flex flex-col">
            <div className="flex flex-row items-center gap-2">
                <Heading3 margin="bottom">Adresse</Heading3>
                <Tooltip
                    content="Under innstillingene til hvert stoppested kan du velge om gåavstanden, fra tavlens adresse til selve stoppestedet, skal vises"
                    placement="top"
                >
                    <ValidationInfoIcon className="mb-2" />
                </Tooltip>
            </div>
            <div className="h-full">
                <SearchableDropdown
                    label="Hvor befinner tavlen seg?"
                    items={pointItems}
                    selectedItem={selectedPoint}
                    onChange={setSelectedPoint}
                    debounceTimeout={1000}
                    clearable
                />
            </div>
        </div>
    )
}

export { Address }
