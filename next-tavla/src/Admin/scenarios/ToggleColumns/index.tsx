import type { TColumn, TQuayTile, TStopPlaceTile } from 'types/tile'
import { OptionalColumns, Columns } from 'types/tile'
import { Switch } from '@entur/form'
import { Label } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { containsColumn, togglePlatform } from './utils'

function ToggleColumns<T extends TStopPlaceTile | TQuayTile>({
    tile,
}: {
    tile: T
}) {
    const dispatch = useSettingsDispatch()

    function handleSwitch(column: TColumn) {
        const oldColumns = tile.columns
        let newColumns

        if (column === 'platform' && oldColumns)
            newColumns = togglePlatform(oldColumns)

        if (!newColumns) throw new Error('New columns were not set properly')

        dispatch({ type: 'setColumns', columns: newColumns, tileId: tile.uuid })
    }

    return (
        <div>
            <Label>Legg til kolonner</Label>
            {OptionalColumns.map((col) => {
                return (
                    <Switch
                        checked={
                            tile.columns &&
                            containsColumn(tile.columns, col.type)
                        }
                        onChange={() => handleSwitch(col.type)}
                        key={col.type}
                    >
                        {Columns[col.type]}
                    </Switch>
                )
            })}
        </div>
    )
}

export { ToggleColumns }
