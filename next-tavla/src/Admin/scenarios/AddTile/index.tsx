import React, { useState } from 'react'
import { Button } from '@entur/button'
import classes from './styles.module.css'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Dropdown } from '@entur/dropdown'
import { fetchItems } from 'Admin/utils'
import { SearchIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'
import { useToast } from '@entur/alert'

function AddTile() {
    const dispatch = useSettingsDispatch()
    const { addToast } = useToast()
    const [stopPlaceId, setStopPlaceId] = useState<string>()

    function handleAddTile() {
        if (!stopPlaceId) {
            addToast({
                title: 'Ingen holdeplass er valgt',
                content: 'Vennligst velg en holdeplass å legge til',
                variant: 'info',
            })
            return
        }
        dispatch({
            type: 'addTile',
            tile: {
                type: 'stop_place',
                placeId: stopPlaceId,
            },
        })
    }
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
                        setStopPlaceId(e?.value)
                    }}
                />

                <Button variant="primary" onClick={handleAddTile}>
                    Legg til
                </Button>
            </div>
        </div>
    )
}

export { AddTile }
