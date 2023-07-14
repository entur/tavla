import { Heading4, Label } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Columns, DefaultColumns, TColumn } from 'types/column'
import { TTile } from 'types/tile'
import { Switch } from '@entur/form'
import classes from './styles.module.css'

function ToggleColumns({ tile }: { tile: TTile }) {
    const dispatch = useSettingsDispatch()

    const optionalColumns: TColumn[] = ['platform', 'via']

    function handleSwitch(column: TColumn, value: boolean) {
        dispatch({
            type: 'setColumn',
            column: column,
            value: value,
            tileId: tile.uuid,
        })
    }
    const columns = { ...DefaultColumns, ...tile.columns }
    return (
        <div>
            <Heading4>Legg til ekstra detaljer til holdeplassen</Heading4>
            <Label>
                Denne ekstra informasjonen vil bli lagt til i denne spesifikke
                holdeplassen, dersom du krysser den av.
            </Label>
            <div className={classes.columnToggleWrapper}>
                {optionalColumns.map((col) => {
                    return (
                        <Switch
                            key={col}
                            checked={columns[col]}
                            onChange={() => handleSwitch(col, !columns[col])}
                        >
                            {Columns[col]}
                        </Switch>
                    )
                })}
            </div>
        </div>
    )
}

export { ToggleColumns }
