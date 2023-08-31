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
    function searchBoards(
        board: {
            id: string
            settings?: TSettings | undefined
        },
        search: RegExp,
    ) {
        const title = board.settings?.title || ''
        return search.test(title)
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
                        .filter((board) => searchBoards(board, textSearchRegex))
                        .map((board) => (
                            <Row key={board.id} board={board} />
                        ))}
                </div>
            </div>
        </div>
    )
}

export { List }
