import { TableHeader } from '../TableHeader'
import { Row } from '../Row'
import { TSettings } from 'types/settings'
import classes from './styles.module.css'

function List({
    boards,
}: {
    boards: { id: string; settings: TSettings | undefined }[]
}) {
    return (
        <div>
            <div className={classes.table}>
                <TableHeader />
                <div className={classes.tableBody}>
                    {boards.map(
                        (board) =>
                            board.id && <Row key={board.id} board={board} />,
                    )}
                </div>
            </div>
        </div>
    )
}

export { List }
