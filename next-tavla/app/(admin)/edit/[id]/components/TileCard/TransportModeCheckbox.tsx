import { TTransportMode } from 'types/graphql-schema'
import { TTile } from 'types/tile'
import { TransportIcon } from 'components/TransportIcon'
import { transportModeNames } from './utils'
import { Checkbox } from '@entur/form'
import classes from './styles.module.css'

function TransportModeCheckbox({
    tile,
    transportMode,
}: {
    tile: TTile
    transportMode: TTransportMode | null
}) {
    return (
        <div>
            <div className="flexRow g-2 alignCenter justifyStart weight600">
                <TransportIcon
                    transportMode={transportMode}
                    className="w-4 h-4"
                />
                {transportModeNames(transportMode)}
            </div>
            <div className={classes.divider} />
            <div className="flexRow alignCenter">
                <Checkbox
                    defaultChecked={
                        !tile.whitelistedLines ||
                        tile.whitelistedLines.length === 0
                    }
                    onChange={(e) => {
                        document
                            .getElementsByName(`${tile.uuid}-${transportMode}`)
                            .forEach((input) => {
                                if (input instanceof HTMLInputElement)
                                    input.checked = e.currentTarget.checked
                            })
                    }}
                >
                    Velg alle
                </Checkbox>
            </div>
        </div>
    )
}

export { TransportModeCheckbox }
