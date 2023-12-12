import { TBoardsColumn } from 'Admin/types/boards'
import classes from './styles.module.css'

function Column({
    column,
    children,
}: {
    column: TBoardsColumn
    children: React.ReactNode
}) {
    return (
        <div id={column} className={classes.column}>
            {children}
        </div>
    )
}

export { Column }
