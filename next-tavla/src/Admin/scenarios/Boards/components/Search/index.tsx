import { TextField } from '@entur/form'
import {
    useBoardsSettings,
    useBoardsSettingsDispatch,
} from '../../utils/context'
import { useCallback } from 'react'
import { SearchIcon } from '@entur/icons'

function Search() {
    const settings = useBoardsSettings()
    const dispatch = useBoardsSettingsDispatch()

    const setSearch = useCallback(
        (search: string) => dispatch({ type: 'setSearch', search }),
        [],
    )

    return (
        <TextField
            label="Søk på navn på tavle"
            prepend={<SearchIcon inline />}
            value={settings.search}
            onChange={(e) => setSearch(e.target.value)}
        />
    )
}

export { Search }
