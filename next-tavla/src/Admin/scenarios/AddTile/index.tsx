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
    const [tileId, setTileId] = useState<string>()
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
                        setTileId(e?.value)
                    }}
                />

                <Button
                    variant="primary"
                    onClick={() => {
                        if (tileId) {
                            dispatch({
                                type: 'addTile',
                                tile: { type: 'stop_place', placeId: tileId },
                            })
                        }
                    }}
                    disabled={!tileId}
                >
                    Legg til
                </Button>
            </div>
        </div>
    )
}

export { AddTile }
