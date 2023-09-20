import classes from './styles.module.css'
import { CheckIcon } from '@entur/icons'
import { useState } from 'react'
import { OverflowMenu, OverflowMenuItem } from '@entur/menu'
import { SecondaryButton } from '@entur/button'
import { TBoard } from 'types/settings'
import { TableHeader } from './components/TableHeader'
import { useBoardsSettings } from '../Boards/utils/context'

function BoardList({ boards }: { boards: TBoard[] }) {
    const settings = useBoardsSettings()
    const textSearchRegex = new RegExp(settings.search, 'i')
    const sortOptions = [
        { label: 'Alfabetisk A-Å', value: 'alphabetical' },
        { label: 'Omvendt alfabetisk Å-A', value: 'unalphabetical' },
    ]
    const [selectedSort, setSelectedSort] = useState(sortOptions[0])

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
            </div>
        </div>
    )
}

export { BoardList }
