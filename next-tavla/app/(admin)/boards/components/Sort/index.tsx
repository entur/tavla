import { useCallback } from 'react'
import { IconButton } from '@entur/button'
import { SortableColumns, TBoardsColumn, TSort } from 'Admin/types/boards'
import { DownArrowIcon, UnsortedIcon, UpArrowIcon } from '@entur/icons'
import { includes } from 'lodash'
import { getAriaLabel } from './utils'
import { useSearchParamReplacer } from '../../hooks/useSearchParamReplacer'

function Sort({ column }: { column: TBoardsColumn }) {
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

    const cycleSort = useCallback(() => {
        const sort = {
            column: sortParams?.[0] as TBoardsColumn,
            type: sortParams?.[1] as TSort,
        }

        if (sort.column !== column) return setSort('ascending')

        switch (sort.type) {
            case 'ascending':
                return setSort('descending')
            case 'descending':
                return setSort('none')
            default:
                return setSort('ascending')
        }
    }, [setSort, column, sortParams])

    if (!includes(SortableColumns, column)) return null

    const active = sortParams?.[0] === column
    const sortType = sortParams?.[1] as TSort

    return (
        <IconButton onClick={cycleSort} aria-label={getAriaLabel(sortType)}>
            <Icon active={active} sort={sortType} />
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
