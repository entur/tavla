import { useCallback } from 'react'
import { IconButton } from '@entur/button'
import {
    useBoardsSettings,
    useBoardsSettingsDispatch,
} from '../../utils/context'
import { SortableColumns, TBoardsColumn, TSort } from 'Admin/types/boards'
import { DownArrowIcon, UnsortedIcon, UpArrowIcon } from '@entur/icons'
import { includes } from 'lodash'
import { getAriaLabel } from 'Admin/scenarios/Edit/utils/arialabels'

function Sort({ column }: { column: TBoardsColumn }) {
    const settings = useBoardsSettings()
    const dispatch = useBoardsSettingsDispatch()

    const setSort = useCallback(
        (type: TSort) => {
            const sort = { type, column }
            dispatch({ type: 'setSort', sort })
        },
        [dispatch, column],
    )

    const cycleSort = useCallback(() => {
        if (settings.sort.column !== column) return setSort('ascending')

        switch (settings.sort.type) {
            case 'ascending':
                return setSort('descending')
            case 'descending':
                return setSort('none')
            default:
                return setSort('ascending')
        }
    }, [settings.sort, setSort, column])

    if (!includes(SortableColumns, column)) return null

    return (
        <IconButton
            onClick={cycleSort}
            aria-label={getAriaLabel(settings.sort.type)}
        >
            <Icon
                active={settings.sort.column === column}
                sort={settings.sort.type}
            />
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
