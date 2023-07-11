import React, { useState } from 'react'
import { Button } from '@entur/button'
import classes from './styles.module.css'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Dropdown } from '@entur/dropdown'
import { fetchItems } from 'Admin/utils'
import { SearchIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'

function AddTile() {
    const dispatch = useSettingsDispatch()
    const [value, setTileValue] = useState<string>()
    return (
        <div>
            <Heading1 className={classes.Heading1}>Holdeplasser</Heading1>

            <div className={classes.SearchContainer}>
                <Dropdown
                    className={classes.DropDown}
                    items={fetchItems}
                    label="Søk etter holdeplass..."
                    searchable
                    debounceTimeout={1000}
                    clearable
                    prepend={<SearchIcon />}
                    onChange={(e) => {
                        if (e?.value) setTileValue(e.value)
                        else setTileValue(undefined)
                    }}
                />

                <Button
                    variant="primary"
                    onClick={() => {
                        if (value) {
                            dispatch({
                                type: 'addTile',
                                tile: { type: 'stop_place', placeId: value },
                            })
                        }
                    }}
                    disabled={!value}
                >
                    Legg til
                </Button>
            </div>
        </div>
    )
}

export { AddTile }
