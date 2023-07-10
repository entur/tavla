import React, { useState } from 'react'
import { Button } from '@entur/button'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Dropdown } from '@entur/dropdown'
import { fetchItems } from 'Admin/utils'
import { SearchIcon } from '@entur/icons'

function AddTile() {
    const dispatch = useSettingsDispatch()
    const [value, setTileValue] = useState('')

    return (
        <div>
            <Dropdown
                items={fetchItems}
                label="Søk etter holdeplass..."
                searchable
                debounceTimeout={1000}
                clearable
                prepend={<SearchIcon />}
                onChange={(e) => {
                    if (e?.value) {
                        setTileValue(e.value)
                    }
                }}
            />

            <Button
                variant="primary"
                onClick={() => {
                    dispatch({
                        type: 'addTile',
                        tile: { type: 'stop_place', placeId: value },
                    })
                }}
            >
                Legg til
            </Button>
        </div>
    )
}

export { AddTile }
