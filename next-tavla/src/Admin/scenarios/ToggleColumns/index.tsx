import { Heading2 } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { TColumn } from 'types/column'
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

    return (
        <div>
            <Heading2>Legg til informasjon</Heading2>

            {optionalColumns.map((col) => {
                return (
                    <Switch
                        key={col}
                        checked={tile.columns && tile.columns[col]}
                        onChange={() =>
                            handleSwitch(
                                col,
                                !(tile.columns && tile.columns[col]),
                            )
                        }
                    >
                        {col}
                    </Switch>
                )
            })}
        </div>
    )
}

export { ToggelColumns }
