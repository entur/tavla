import { IconButton } from '@entur/button'
import { DownArrowIcon, UnsortedIcon, UpArrowIcon } from '@entur/icons'
import { SortableColumns, TSort, TTableColumn } from 'app/(admin)/utils/types'
import { includes } from 'lodash'
import { useCallback } from 'react'
import { useSearchParamReplacer } from '../../hooks/useSearchParamReplacer'
import { getAriaLabel } from './utils'

function Sort({ column }: { column: TTableColumn }) {
    const [value, replace] = useSearchParamReplacer('sort')
    const sortParams = value?.split(':')

    const setSort = useCallback(
        (sort: TSort) => {
            if (sort === 'none') return replace(undefined)
            const newSort = `${column}:${sort}`
            replace(newSort)
        },
        [column, replace],
    )

    const sort = {
        column: sortParams?.[0] as TTableColumn,
        type: sortParams?.[1] as TSort,
    }

    const cycleSort = useCallback(() => {
        if (sort.column !== column) return setSort('ascending')

        switch (sort.type) {
            case 'ascending':
                return setSort('descending')
            case 'descending':
                return setSort('none')
            default:
                return setSort('ascending')
        }
    }, [setSort, column, sort.column, sort.type])

    if (!includes(SortableColumns, column)) return null

    return (
        <IconButton onClick={cycleSort} aria-label={getAriaLabel(sort.type)}>
            <Icon active={sort.column === column} sort={sort.type} />
        </IconButton>
    )
}

function Icon({ active, sort }: { active: boolean; sort: TSort }) {
    if (!active) return <UnsortedIcon />

    switch (sort) {
        case 'ascending':
            return <UpArrowIcon />
        case 'descending':
            return <DownArrowIcon />
        default:
            return <UnsortedIcon />
    }
}

export { Sort }
