import { IconButton } from '@entur/button'
import classes from './styles.module.css'
import { DownArrowIcon, UnsortedIcon, UpArrowIcon } from '@entur/icons'
import { Cell } from '../BoardList/components/Cell'
import { TSortableColumn } from 'Admin/types/sorting'

function TableHeader({
    headerCells,
    onHeaderClick,
    sorting,
}: {
    headerCells: { label: string; value: string; sortable: boolean }[]
    onHeaderClick: (column: TSortableColumn) => void
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
                                    onHeaderClick(cell.value as TSortableColumn)
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
