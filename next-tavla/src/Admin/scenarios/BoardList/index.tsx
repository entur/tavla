import { TableHeader } from '../TableHeader'
import { Row } from './components/Row'
import classes from './styles.module.css'
import { TextField } from '@entur/form'
import { CheckIcon, SearchIcon } from '@entur/icons'
import { useState } from 'react'
import { OverflowMenu, OverflowMenuItem } from '@entur/menu'
import { SecondaryButton } from '@entur/button'
import { TBoard } from 'types/settings'

function BoardList({ boards }: { boards: TBoard[] }) {
    const [filterSearch, setFilterSearch] = useState('')
    const textSearchRegex = new RegExp(filterSearch, 'i')
    const sortOptions = [
        { label: 'Alfabetisk A-Å', value: 'alphabetical' },
        { label: 'Omvendt alfabetisk Å-A', value: 'unalphabetical' },
    ]
    const [selectedSort, setSelectedSort] = useState(sortOptions[0])

<<<<<<< HEAD
    const sortBoards = (boardA: TBoard, boardB: TBoard) => {
        const titleA = boardA?.title?.toLowerCase() ?? ''
        const titleB = boardB?.title?.toLowerCase() ?? ''
=======
    const sortBoards = (
        a: { settings?: TSettings },
        b: { settings?: TSettings },
    ) => {
        const titleA = a.settings?.meta?.title?.toLowerCase() ?? ''
        const titleB = b.settings?.meta?.title?.toLowerCase() ?? ''
>>>>>>> cb7a7958 (feat(date) meta type with meta information)
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
            <div className={classes.tableFunctions}>
                <TextField
                    className={classes.search}
                    label="Søk på navn på tavle"
                    prepend={<SearchIcon inline />}
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                />
                <OverflowMenu
                    className={classes.sort}
                    button={<SecondaryButton>Sorter</SecondaryButton>}
                >
                    {sortOptions.map((option) => (
                        <OverflowMenuItem
                            className={classes.sortItem}
                            key={option.value}
                            onSelect={() => {
                                setSelectedSort(option)
                            }}
                        >
                            {option.label}
                            {selectedSort?.value === option.value && (
                                <CheckIcon inline />
                            )}
                        </OverflowMenuItem>
                    ))}
                </OverflowMenu>
            </div>
            <div className={classes.table}>
                <TableHeader />
                <div className={classes.tableBody}>
                    {boards
                        .filter((board) =>
<<<<<<< HEAD
                            textSearchRegex.test(board?.title ?? ''),
=======
                            textSearchRegex.test(
                                board.settings?.meta?.title ?? '',
                            ),
>>>>>>> cb7a7958 (feat(date) meta type with meta information)
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

export { BoardList }
