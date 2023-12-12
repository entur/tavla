'use client'
import { TextField } from '@entur/form'
import { SearchIcon } from '@entur/icons'
import { useParamsSetter } from 'app/(admin)/boards/hooks/useParamsSetter'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'

function Search() {
    const { setQuery } = useParamsSetter()

    return (
        <TextField
            className="w-50"
            label="Søk på navn på tavle"
            prepend={<SearchIcon inline aria-hidden="true" />}
            value={usePageParam('search').pageParam ?? ''}
            onChange={(e) => {
                setQuery('search', e.target.value)
            }}
        />
    )
}

export { Search }
