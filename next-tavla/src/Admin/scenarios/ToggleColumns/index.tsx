import { Heading3, Heading4 } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { DefaultColumns, TColumn } from 'types/column'
import { TTile } from 'types/tile'
import { Switch } from '@entur/form'

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
            <Heading4>Legg til informasjon</Heading4>

            {optionalColumns.map((col) => {
                return (
                    <Switch
                        key={col}
                        checked={columns[col]}
                        onChange={() => handleSwitch(col, !columns[col])}
                    >
                        {col}
                    </Switch>
                )
            })}
        </div>
    )
}

export { ToggleColumns }
