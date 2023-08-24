import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown'
import { Heading4, SubParagraph } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { QuaysSearchQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { useState } from 'react'
import { TQuayTile, TStopPlaceTile, TTile } from 'types/tile'
import { isNotNullOrUndefined } from 'utils/typeguards'

const stopPlaceOption = { value: 'stopPlace', label: 'Vis alle' }

function getPlatformLabel(
    publicCode: string | null | undefined,
    description: string | null | undefined,
    index: number,
) {
    if (!publicCode && !description) {
        return `Ikke navngitt ${index + 1}`
    }
    return [publicCode, description].filter(isNotNullOrUndefined).join(' ')
}

function PlatformDropdown({ tile }: { tile: TStopPlaceTile | TQuayTile }) {
    const dispatch = useSettingsDispatch()

    const setTile = (newTile: TTile) => {
        dispatch({ type: 'setTile', tile: newTile })
    }

    const stopPlaceId = tile.type === 'quay' ? tile.stopPlaceId : tile.placeId

    const { data } = useQuery(QuaysSearchQuery, { stopPlaceId })

    const quays =
        data?.stopPlace?.quays
            ?.filter(isNotNullOrUndefined)
            .map((quay, index) => ({
                value: quay.id,
                label: getPlatformLabel(
                    quay.publicCode,
                    quay.description,
                    index,
                ),
            }))
            .sort((a, b) => {
                return a.label.localeCompare(b.label, 'no-NB', {
                    numeric: true,
                })
            }) || []

    const dropDownOptions = () => [stopPlaceOption, ...quays]

    const [selectedDropdownItem, setSelectedDropdownItem] =
        useState<NormalizedDropdownItemType | null>(null)

    return (
        <div>
            <Heading4>Plattform/retning</Heading4>
            <SubParagraph>
                Du kan enten vise alle plattformer/retninger eller kun én.
            </SubParagraph>
            <Dropdown
                items={dropDownOptions}
                label="Velg plattform/retning"
                disabled={!stopPlaceId}
                selectedItem={selectedDropdownItem}
                onChange={(item) => {
                    if (!item?.value) return

                    setSelectedDropdownItem(item)

                    if (item.value === stopPlaceOption.value)
                        setTile({
                            ...tile,
                            type: 'stop_place',
                            placeId: stopPlaceId,
                        })
                    else
                        setTile({
                            ...tile,
                            type: 'quay',
                            stopPlaceId,
                            placeId: item.value,
                        })
                }}
            />
        </div>
    )
}

export { PlatformDropdown }
