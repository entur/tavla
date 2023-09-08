import { TableHeader } from '../TableHeader'
import { Row } from './components/Row'
import { TSettings } from 'types/settings'
import classes from './styles.module.css'
import { TextField } from '@entur/form'
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

        }
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
                />
                <div className={classes.tableBody}>
                    {boards
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
