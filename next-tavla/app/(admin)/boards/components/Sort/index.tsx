import { useCallback } from 'react'
import { IconButton } from '@entur/button'
import { SortableColumns, TBoardsColumn, TSort } from 'Admin/types/boards'
import { DownArrowIcon, UnsortedIcon, UpArrowIcon } from '@entur/icons'
import { includes } from 'lodash'
import { getAriaLabel } from './utils'
import { useParamsSetter } from 'app/(admin)/boards/hooks/useParamsSetter'
import { useBoardsSettings } from '../../hooks/useBoardsSettings'

function Sort({ column }: { column: TBoardsColumn }) {
    const { setQuery, deleteQuery } = useParamsSetter()

    const { sort } = useBoardsSettings()

    const setSort = useCallback(
        (sort: TSort) => {
            if (sort === 'none') {
                return deleteQuery('sort')
            }
            const newSort = `${column}:${sort}`
            setQuery('sort', newSort)
        },
        [column, setQuery, deleteQuery],
    )

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
    }, [sort, setSort, column])

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
