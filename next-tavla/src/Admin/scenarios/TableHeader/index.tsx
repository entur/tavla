import classes from './styles.module.css'
import { Cell } from '../BoardList/components/Cell'

function TableHeader({
    headerCells,
    return (
        <div className={classes.tableHead}>
            <div className={classes.headerRow}>
                {headerCells.map((cell) => (
                    <Cell className={classes.headerCell} key={cell.value}>
                        {cell.label}
                    </Cell>
                ))}
            </div>
        </div>
    )
}

export { TableHeader }
