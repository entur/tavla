//import React, { useState } from 'react'
import { Button } from '@entur/button'
//import classes from './styles.module.css'
//import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Dropdown } from '@entur/dropdown'
import { fetchItems } from 'Admin/utils'
import { SearchIcon } from '@entur/icons'

function AddTile() {
    //const dispatch = useSettingsDispatch()

    return (
        <div>
            <Dropdown
                items={fetchItems}
                label="Søk etter holdeplass..."
                searchable
                debounceTimeout={1000}
                clearable
                prepend={<SearchIcon />}
            />

            <Button
                variant="primary"
                onClick={() => {
                    // dispatch({
                    //     type: 'addTile',
                    //     tile,
                    // })
                }}
            >
                Legg til
            </Button>
        </div>
    )
}

export { AddTile }
