import { Dropdown } from '@entur/dropdown'
import { Heading4, SubParagraph } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { QuaysSearchQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TTile } from 'types/tile'
import {
    isNotNullOrUndefined,
    isNotNullOrUndefinedOrEmptyString,
} from 'utils/typeguards'
import classes from './styles.module.css'

const stopPlaceOption = { value: 'stopPlace', label: 'Vis alle' }

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

    const getPlatformLabel = (
        publicCode: string | null,
        description: string | null,
    ) => {
        if (!publicCode && !description) {
            return 'Ikke navngitt'
        }
        return [
            isNotNullOrUndefinedOrEmptyString(publicCode) ? publicCode : '',
            description ?? '',
        ].join(' ')
    }

    const quays =
        data?.stopPlace?.quays
            ?.filter(isNotNullOrUndefined)
            .map((quay) => ({
                value: quay.id,
                label: getPlatformLabel(quay.publicCode, quay.description),
            }))
            .sort((a, b) => {
                return a.label.localeCompare(b.label)
            }) || []

    const dropDownOptions = () => [stopPlaceOption, ...quays]

    return (
        <div>
            <Heading4>Velg plattform/retning</Heading4>
            <SubParagraph>
                Du kan enten vise alle plattformer/retninger eller kun én.
            </SubParagraph>
            <Dropdown
                className={classes.dropdown}
                items={dropDownOptions}
                label="Velg plattform/retning"
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
