import {
    OrganizationsColumns,
    TOrganizationsColumn,
} from 'Admin/types/organizations'
import classes from './styles.module.css'

function TableHeader({ columns }: { columns: TOrganizationsColumn[] }) {
    return (
        <>
            {columns.map((column) => (
                <div key={column} className={classes.header}>
                    {OrganizationsColumns[column]}
                </div>
            ))}
        </>
    )
}

export { TableHeader }
