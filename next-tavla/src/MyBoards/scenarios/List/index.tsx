import { Table, TableBody } from '@entur/table'
import { TableHeader } from '../TableHeader'
import { Row } from '../Row'
import { TSettings } from 'types/settings'

function List({
    boards,
}: {
    boards: { id: string; settings: TSettings | undefined }[]
}) {
    return (
        <div>
            <Table>
                <TableHeader />
                <TableBody>
                    {boards.map(
                        (board) =>
                            board.id && <Row key={board.id} board={board} />,
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export { List }
