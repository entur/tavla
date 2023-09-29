import { useState } from 'react'
import { Button } from '@entur/button'
import classes from './styles.module.css'
import { NormalizedDropdownItemType, SearchableDropdown } from '@entur/dropdown'
import { fetchItems } from 'Admin/utils/fetch'
import { SearchIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'
import { useToast } from '@entur/alert'
import { useEditSettingsDispatch } from '../../utils/contexts'
import { useDebouncedFetch } from 'hooks/useDebouncedFetch'

function AddTile() {
    const dispatch = useEditSettingsDispatch()
    const { addToast } = useToast()
    const [selectedDropdownItem, setSelectedDropdownItem] =
        useState<NormalizedDropdownItemType | null>(null)

    const debouncedFetch = useDebouncedFetch(500, fetchItems)

    function handleAddTile() {
        if (!selectedDropdownItem?.value) {
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
                placeId: selectedDropdownItem.value,
                name:
                    selectedDropdownItem.label.split(',')[0] ?? 'Ikke navngitt',
            },
        })
        setSelectedDropdownItem(null)
    }

    return (
        <div>
            <Heading1>Holdeplasser i tavla</Heading1>

            <div className={classes.SearchContainer}>
                <SearchableDropdown
                    className={classes.DropDown}
                    items={debouncedFetch}
                    label="Søk etter holdeplass..."
                    clearable
                    prepend={<SearchIcon />}
                    selectedItem={selectedDropdownItem}
                    onChange={setSelectedDropdownItem}
                />

                <Button variant="primary" onClick={handleAddTile}>
                    Legg til
                </Button>
            </div>
        </div>
    )
}

export { AddTile }
