import {
    OrganizationsColumns,
    TOrganizationsColumn,
} from 'Admin/types/organizations'
import classes from './styles.module.css'
import { StyledColumn } from '../Column/StyledColumn'

function TableHeader({ columns }: { columns: TOrganizationsColumn[] }) {
    return (
        <>
            {columns.map((column) => (
                <StyledColumn key={column} className={classes.header}>
                    {OrganizationsColumns[column]}
                </StyledColumn>
            ))}
        </>
    )
}

export { TableHeader }
