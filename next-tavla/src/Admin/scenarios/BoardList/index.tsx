import { TableHeader } from '../TableHeader'
import { Row } from './components/Row'
import { TSettings } from 'types/settings'
import classes from './styles.module.css'
import { TextField } from '@entur/form'
import { SearchIcon } from '@entur/icons'
import { useState } from 'react'

function BoardList({
    boards,
}: {
    boards: { id: string; settings?: TSettings }[]
}) {
    const headerCells = [
        { label: 'Navn på tavle', value: 'title', sortable: true },
        { label: 'Link', value: 'link', sortable: false },
        { label: 'Valg', value: 'options', sortable: false },
    ]
    const [filterSearch, setFilterSearch] = useState('')
    const textSearchRegex = new RegExp(filterSearch, 'i')
    const [sorting, setSorting] = useState({
        column: '',
        order: 'default',
    })

    const handleHeaderClick = (column: string, sortable: boolean) => {
        if (sortable) {
            setSorting((prevSorting) => {
                if (prevSorting.column === column) {
                    switch (prevSorting.order) {
                        case 'default':
                            return { column, order: 'asc' }
                        case 'asc':
                            return { column, order: 'desc' }
                        default:
                            return { column: 'title', order: 'default' }
                    }
                } else {
                    return { column, order: 'asc' }
                }
            })
        }
    }

    function sortBoards() {
        const sortedBoards = [...boards]
        if (sorting.order !== 'default') {
            sortedBoards.sort((a, b) => {
                const columnValueA = a.settings?.title ?? ''
                const columnValueB = b.settings?.title ?? ''
                return sorting.order === 'asc'
                    ? columnValueA.localeCompare(columnValueB)
                    : columnValueB.localeCompare(columnValueA)
            })
        }
        return sortedBoards
    }

    return (
        <div className={classes.tableWrapper}>
            <div className={classes.tableFunctions}>
                <TextField
                    className={classes.search}
                    label="Søk på navn på tavle"
                    prepend={<SearchIcon inline />}
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                />
            </div>
            <div className={classes.table}>
                <TableHeader
                    headerCells={headerCells}
                    onHeaderClick={handleHeaderClick}
                    sorting={sorting}
                />
                <div className={classes.tableBody}>
                    {sortBoards()
                        .filter((board) =>
                            textSearchRegex.test(board.settings?.title ?? ''),
                        )
                        .map((board) => (
                            <Row key={board.id} board={board} />
                        ))}
                </div>
            </div>
        </div>
    )
}

export { BoardList }
