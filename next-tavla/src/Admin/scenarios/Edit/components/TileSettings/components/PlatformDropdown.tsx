import { Dropdown } from '@entur/dropdown'
import { Heading4, SubParagraph } from '@entur/typography'
import { useEditSettingsDispatch } from 'Admin/scenarios/Edit/utils/contexts'
import { transportModeNames } from 'Admin/utils/transport'
import { QuaysSearchQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TTransportMode } from 'types/graphql-schema'
import { TQuayTile, TStopPlaceTile, TTile } from 'types/tile'
import { hasDuplicateInArrayByKey } from 'utils/filters'
import { isNotNullOrUndefined, isTransportModeArray } from 'utils/typeguards'

const stopPlaceOption = { value: 'stopPlace', label: 'Vis alle' }

function getPlatformLabel(
    index: number,
    publicCode?: string | null,
    description?: string | null,
) {
    if (!publicCode && !description) {
        return `Ikke navngitt ${index + 1}`
    }
    return [publicCode, description].filter(isNotNullOrUndefined).join(' ')
}

function getQuayTransportModes(
    transportModes: (TTransportMode | null)[] | null | undefined,
) {
    if (isTransportModeArray(transportModes))
        return `${transportModes
            .map((item) => item && transportModeNames[item])
            .join(', ')}`

    return transportModeNames['unknown']
}

function PlatformDropdown({ tile }: { tile: TStopPlaceTile | TQuayTile }) {
    const dispatch = useEditSettingsDispatch()

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
                    index,
                    quay.publicCode,
                    quay.description,
                ),
                transportModes: quay.stopPlace?.transportMode,
            }))
            .sort((a, b) => {
                return a.label.localeCompare(b.label, 'no-NB', {
                    numeric: true,
                })
            })
            .map((item, index, array) => {
                if (!hasDuplicateInArrayByKey(array, item, 'label')) {
                    return item
                } else {
                    return {
                        ...item,
                        label: `${item.label} (${getQuayTransportModes(
                            item.transportModes,
                        )})`,
                    }
                }
            }) || []

    const dropDownOptions = () => [stopPlaceOption, ...quays]

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
                selectedItem={
                    dropDownOptions().find(
                        ({ value }) => tile.placeId === value,
                    ) || stopPlaceOption
                }
                onChange={(item) => {
                    if (!item?.value) return

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
