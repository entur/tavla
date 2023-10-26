import {
    OrganizationsColumns,
    TOrganizationsColumn,
} from 'Admin/types/organizations'
import classes from './styles.module.css'
import { Cell } from '../Column/Cell'

function TableHeader({ columns }: { columns: TOrganizationsColumn[] }) {
    return (
        <>
            {columns.map((column) => (
                <Cell
                    key={column}
                    className={`${classes.header} ${classes[column] ?? ''}`}
                >
                    {OrganizationsColumns[column]}
                </Cell>
            ))}
        </>
    )
}

export { TableHeader }
