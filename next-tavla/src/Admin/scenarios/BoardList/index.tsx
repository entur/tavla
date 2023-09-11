import { TableHeader } from '../TableHeader'
import { Row } from './components/Row'
import classes from './styles.module.css'
import { TextField } from '@entur/form'
import { CheckIcon, SearchIcon } from '@entur/icons'
import { useState } from 'react'
import { OverflowMenu, OverflowMenuItem } from '@entur/menu'
import { SecondaryButton } from '@entur/button'
import { TBoard } from 'types/settings'
import { BoardListOptions } from './components/BoardListOptions'
import { TOptionalColumn, optionalColumns } from 'types/optionalColumns'

function BoardList({ boards }: { boards: TBoard[] }) {
    const [filterSearch, setFilterSearch] = useState('')
    const textSearchRegex = new RegExp(filterSearch, 'i')
    const sortOptions = [
        { label: 'Alfabetisk A-Å', value: 'alphabetical' },
        { label: 'Omvendt alfabetisk Å-A', value: 'unalphabetical' },
    ]
    const [selectedSort, setSelectedSort] = useState(sortOptions[0])

    const [shownOptionalColumns, setShownOptionalColumns] =
        useState<TOptionalColumn[]>(optionalColumns)

    const columnCount = shownOptionalColumns.length

    const sortBoards = (boardA: TBoard, boardB: TBoard) => {
        const titleA = boardA?.title?.toLowerCase() ?? ''
        const titleB = boardB?.title?.toLowerCase() ?? ''

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

    const tableColumnsStyle: React.CSSProperties = {
        gridTemplateColumns:
            '20rem minmax(25rem,' +
            (columnCount > 0
                ? ` 30rem)  repeat(${columnCount}, minmax(8rem, auto)) 5rem`
                : ' auto) 5rem'),
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
                <BoardListOptions
                    {...{
                        shownOptionalColumns,
                        setShownOptionalColumns,
                        optionalColumns,
                    }}
                />
            </div>
            <div className={classes.table} style={tableColumnsStyle}>
                <TableHeader {...{ shownColumns: shownOptionalColumns }} />
                {boards
                    .filter((board) => textSearchRegex.test(board.title ?? ''))
                    .sort(sortBoards)
                    .map((board) => (
                        <Row
                            key={board.id}
                            {...{ board, shownOptionalColumns }}
                        />
                    ))}
            </div>
        </div>
    )
}

export { BoardList }
