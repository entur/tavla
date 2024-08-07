import {
    NormalizedDropdownItemType,
    PotentiallyAsyncDropdownItemType,
    SearchableDropdown,
} from '@entur/dropdown'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading4 } from '@entur/typography'
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
        <div className="box flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
                <Heading4 margin="bottom">Adresse</Heading4>
                <Tooltip
                    content="Under innstillingene til hvert stoppested kan du velge om gåavstanden, fra tavlens adresse til selve stoppestedet, skal vises"
                    placement="top"
                >
                    <ValidationInfoIcon />
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
