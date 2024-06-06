'use client'
import { TextField } from '@entur/form'
import { SearchIcon } from '@entur/icons'
import { useSearchParamReplacer } from '../../hooks/useSearchParamReplacer'
import { useEffect, useState } from 'react'

function Search() {
    const [value, replace] = useSearchParamReplacer('search')
    const [search, setSearch] = useState(value)

    useEffect(() => {
        replace(search)
    }, [replace, search])
    return (
        <TextField
            className="w-full md:w-1/2"
            label="Søk på navn på tavle"
            prepend={<SearchIcon inline aria-hidden="true" />}
            value={search}
            onChange={(e) => {
                setSearch(e.target.value)
            }}
            id="search"
            clearable
            onClear={() => {
                setSearch('')
            }}
        />
    )
}

export { Search }
