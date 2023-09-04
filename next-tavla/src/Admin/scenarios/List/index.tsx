import { TableHeader } from '../TableHeader'
import { Row } from '../Row'
import { TSettings } from 'types/settings'
import classes from './styles.module.css'
import { TextField } from '@entur/form'
import { SearchIcon } from '@entur/icons'
import { useState } from 'react'

function List({ boards }: { boards: { id: string; settings?: TSettings }[] }) {
    const [filterSearch, setFilterSearch] = useState('')
    const textSearchRegex = new RegExp(filterSearch, 'i')
    const sortOptions = [
        { label: 'Alfabetisk A-Å', value: 'alphabetical' },
        { label: 'Omvendt alfabetisk Å-A', value: 'unalphabetical' },
    ]
    const [selectedSort, setSelectedSort] = useState(sortOptions[0])

    const sortBoards = (
        a: { settings?: TSettings },
        b: { settings?: TSettings },
    ): number => {
        const titleA = a.settings?.title?.toLowerCase() || ''
        const titleB = b.settings?.title?.toLowerCase() || ''
        if (!selectedSort) return 0
        switch (selectedSort.value) {
            case 'alphabetical':
                return titleA.localeCompare(titleB)
            case 'unalphabetical':
                return titleB.localeCompare(titleA)
            default:
                return 0
        }
    }

    return (
        <div className={classes.tableWrapper}>
            <TextField
                className={classes.search}
                label="Søk på navn på tavle"
                prepend={<SearchIcon inline />}
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
            />
            <div className={classes.table}>
                <TableHeader />
                <div className={classes.tableBody}>
                    {boards
                        .filter((board) =>
                            textSearchRegex.test(board.settings?.title ?? ''),
                        )
                        .sort(sortBoards)
                        .map((board) => (
                            <Row key={board.id} board={board} />
                        ))}
                </div>
            </div>
        </div>
    )
}

export { List }
