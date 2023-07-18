import { Dropdown } from '@entur/dropdown'
import { Heading4, SubParagraph } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { QuaysSearchQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TTile } from 'types/tile'
import { isNotNullOrUndefined } from 'utils/typeguards'
import classes from './styles.module.css'

const stopPlaceOption = { value: 'stopPlace', label: 'Vis alle' } as const

function PlatformDropdown({
    stopPlaceId,
    tile,
    selectedQuayId,
}: {
    stopPlaceId: string
    tile: TTile
    selectedQuayId?: string
}) {
    const dispatch = useSettingsDispatch()

    const setTile = (newTile: TTile) => {
        dispatch({ type: 'setTile', tile: newTile })
    }

    const selectedValue = selectedQuayId ?? stopPlaceOption.value

    const { data } = useQuery(QuaysSearchQuery, { stopPlaceId })

    const quays =
        data?.stopPlace?.quays
            ?.filter(isNotNullOrUndefined)
            .map((quay, index) => ({
                value: quay.id,
                label:
                    'Platform ' +
                    [quay.publicCode ?? index + 1, quay.description].join(' '),
            })) || []

    const dropDownOptions = () =>
        quays.length ? [{ ...stopPlaceOption }, ...quays] : []

    return (
        <div>
            <Heading4>Velg plattform</Heading4>
            <SubParagraph>
                Avgangstavlen kan enten vise avganger for alle plattformer eller
                kun én.
            </SubParagraph>
            <Dropdown
                className={classes.dropdown}
                items={dropDownOptions}
                label="Velg plattform"
                disabled={!stopPlaceId}
                value={selectedValue}
                onChange={(e) => {
                    if (!e?.value) return

                    if (e.value === stopPlaceOption.value)
                        setTile({
                            type: 'stop_place',
                            placeId: stopPlaceId,
                            uuid: tile.uuid,
                            columns: tile.columns,
                        })
                    else
                        setTile({
                            type: 'quay',
                            stopPlaceId,
                            placeId: e.value,
                            uuid: tile.uuid,
                            columns: tile.columns,
                        })
                }}
            />
        </div>
    )
}

export { PlatformDropdown }
