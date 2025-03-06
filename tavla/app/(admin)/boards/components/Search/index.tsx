'use client'
import { SearchIcon } from '@entur/icons'
import { useSearchParamReplacer } from '../../hooks/useSearchParamReplacer'
import { useEffect, useState } from 'react'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function Search() {
    const [value, replace] = useSearchParamReplacer('search')
    const [search, setSearch] = useState(value)

    useEffect(() => {
        replace(search)
    }, [replace, search])
    return (
        <ClientOnlyTextField
            label="Søk på navn på tavle eller mappe"
            prepend={<SearchIcon aria-hidden="true" />}
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
