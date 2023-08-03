import { Dropdown } from '@entur/dropdown'
import { Heading4, SubParagraph } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { QuaysSearchQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TQuayTile, TStopPlaceTile, TTile } from 'types/tile'
import { isNotNullOrUndefined } from 'utils/typeguards'

const stopPlaceOption = { value: 'stopPlace', label: 'Vis alle' }

function getPlatformLabel(
    publicCode: string | null,
    description: string | null,
) {
    if (!publicCode && !description) {
        return 'Ikke navngitt'
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
            .map((quay) => ({
                value: quay.id,
                label: getPlatformLabel(quay.publicCode, quay.description),
            }))
            .sort((a, b) => {
                return a.label.localeCompare(b.label, 'no-NB', {
                    numeric: true,
                })
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
                value={tile.type === 'quay' ? tile.placeId : 'stopPlace'}
                onChange={(e) => {
                    if (!e?.value) return
                    console.log(e)

                    if (e.value === stopPlaceOption.value)
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
                            placeId: e.value,
                        })
                }}
            />
        </div>
    )
}

export { PlatformDropdown }
