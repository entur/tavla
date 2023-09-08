import { IconButton } from '@entur/button'
import classes from './styles.module.css'
import { DownArrowIcon, UnsortedIcon, UpArrowIcon } from '@entur/icons'
import { Cell } from '../BoardList/components/Cell'

function TableHeader({
    headerCells,
    onHeaderClick,
    sorting,
}: {
    headerCells: { label: string; value: string; sortable: boolean }[]
    onHeaderClick: (column: string, sortable: boolean) => void
    sorting: { column: string; order: string }
}) {
    return (
        <div className={classes.tableHead}>
            <div className={classes.headerRow}>
                {headerCells.map((cell) => (
                    <Cell className={classes.headerCell} key={cell.value}>
                        {cell.label}
                        {cell.sortable && (
                            <IconButton
                                onClick={() =>
                                    onHeaderClick(cell.value, cell.sortable)
                                }
                            >
                                {sorting.column === cell.value ? (
                                    sorting.order === 'asc' ? (
                                        <UpArrowIcon />
                                    ) : sorting.order === 'desc' ? (
                                        <DownArrowIcon />
                                    ) : (
                                        <UnsortedIcon />
                                    )
                                ) : (
                                    <UnsortedIcon />
                                )}
                            </IconButton>
                        )}
                    </Cell>
                ))}
            </div>
        </div>
    )
}

export { TableHeader }
