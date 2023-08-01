import { Heading4, SubParagraph } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Columns, TColumn } from 'types/column'
import { TTile } from 'types/tile'
import { Switch } from '@entur/form'
import classes from './styles.module.css'
import { isArray } from 'lodash'

function ToggleColumns({ tile }: { tile: TTile }) {
    const dispatch = useSettingsDispatch()

    function handleSwitch(column: TColumn) {
        dispatch({
            type: 'setColumn',
            column: column,
            tileId: tile.uuid,
        })
    }
    return (
        <div>
            <Heading4>Velg kolonner</Heading4>
            <SubParagraph>
                Her kan du bestemme hvilke kolonner som skal inngå i din tavle.
            </SubParagraph>
            <div className={classes.columnToggleWrapper}>
                {Object.entries(Columns).map(([key, value]) => {
                    return (
                        <Switch
                            key={key}
                            checked={
                                isArray(tile.columns)
                                    ? tile.columns?.includes(key as TColumn)
                                    : false
                            }
                            onChange={() => handleSwitch(key as TColumn)}
                        >
                            {value}
                        </Switch>
                    )
                })}
            </div>
        </div>
    )
}

export { ToggleColumns }
