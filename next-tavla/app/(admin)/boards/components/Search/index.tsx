'use client'
import { TextField } from '@entur/form'
import { SearchIcon } from '@entur/icons'
import { useSearchParamReplacer } from '../../hooks/useSearchParamReplacer'

function Search() {
    const [value, replace] = useSearchParamReplacer('search')
    return (
        <TextField
            className="w-50"
            label="Søk på navn på tavle"
            prepend={<SearchIcon inline aria-hidden="true" />}
            defaultValue={value}
            onChange={(e) => {
                replace(e.target.value)
            }}
        />
    )
}

export { Search }
