import { TableHeader } from '../TableHeader'
import { Row } from '../Row'
import classes from './styles.module.css'
import { Board } from 'types/board'

function List({ boards }: { boards: Board[] }) {
    return (
        <div>
            <div className={classes.table}>
                <TableHeader />
                <div className={classes.tableBody}>
                    {boards.map((board) => (
                        <Row key={board.id} board={board} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export { List }
