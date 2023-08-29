import { TableHead, HeaderCell, TableRow } from '@entur/table'
import '@entur/table/dist/styles.css'

function TableHeader() {
    return (
        <TableHead>
            <TableRow>
                <HeaderCell>Navn på tavle</HeaderCell>
                <HeaderCell>Link</HeaderCell>
                <HeaderCell>Rediger</HeaderCell>
            </TableRow>
        </TableHead>
    )
}

export { TableHeader }
