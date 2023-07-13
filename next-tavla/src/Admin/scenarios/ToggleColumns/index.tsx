import { Heading3 } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { DefaultColumns, TColumn } from 'types/column'
import { TTile } from 'types/tile'
import { Switch } from '@entur/form'

function ToggelColumns({ tile }: { tile: TTile }) {
    const dispatch = useSettingsDispatch()

    const optionalColumns: TColumn[] = ['platform', 'via']

    function handleSwitch(column: TColumn, value: boolean) {
        dispatch({
            type: 'toggleColumn',
            column: column,
            value: value,
            tileId: tile.uuid,
        })
    }
    const columns = { ...DefaultColumns, ...tile.columns }
    return (
        <div>
            <Heading3>Legg til informasjon</Heading3>

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

export { ToggelColumns }
