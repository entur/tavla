import { TBoardsColumn } from 'app/(admin)/utils/types'
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
