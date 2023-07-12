import { Switch } from '@entur/form'
import { Label } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { useState } from 'react'
import { TColumn } from 'types/column'
import { TTile } from 'types/tile'

function ToggelColumns({ tiles }: { tiles: TTile[] }) {
    const [checked, setChecked] = useState(false)

    const dispatch = useSettingsDispatch()

    function handleSwitch(column: TColumn) {
        tiles.map((tile) => {
            dispatch({
                type: 'toggleColumn',
                column: column,
                value: !checked,
                tileId: tile.uuid,
            })
        })
        setChecked(!checked)
    }

    return (
        <div>
            <Label>Legg til informasjon</Label>
            <Switch checked={checked} onChange={() => handleSwitch('platform')}>
                Platform
            </Switch>
        </div>
    )
}

export { ToggelColumns }
