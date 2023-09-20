import { Row } from './components/Row'
import classes from './styles.module.css'
import { CheckIcon } from '@entur/icons'
import { useState } from 'react'
import { OverflowMenu, OverflowMenuItem } from '@entur/menu'
import { SecondaryButton } from '@entur/button'
import { TBoard } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'Admin/components/IllustratedInfo'
import { TableHeader } from './components/TableHeader'

function BoardList({ boards }: { boards: TBoard[] }) {
    const [filterSearch, setFilterSearch] = useState('')
    const textSearchRegex = new RegExp(filterSearch, 'i')
    const sortOptions = [
        { label: 'Alfabetisk A-Å', value: 'alphabetical' },
        { label: 'Omvendt alfabetisk Å-A', value: 'unalphabetical' },
    ]
    const [selectedSort, setSelectedSort] = useState(sortOptions[0])

    const sortBoards = (boardA: TBoard, boardB: TBoard) => {
        const titleA = boardA?.meta?.title?.toLowerCase() ?? ''
        const titleB = boardB?.meta?.title?.toLowerCase() ?? ''
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
                            textSearchRegex.test(board?.meta?.title ?? ''),
                        )
                        .sort(sortBoards)
                        .map((board) => (
                            <Row key={board.id} board={board} />
                        ))}
                    {isEmpty(boards) && (
                        <IllustratedInfo
                            title="Her var det tomt"
                            description="Du har ikke laget noen Tavler ennå"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export { BoardList }
