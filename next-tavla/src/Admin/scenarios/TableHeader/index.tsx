import { TOptionalColumn } from 'types/optionalColumns'
import { Cell } from '../BoardList/components/Cell'
import classes from './styles.module.css'

function TableHeader({ shownColumns }: { shownColumns: TOptionalColumn[] }) {
    return (
        <>
            <Cell className={classes.headerCell}>Navn på tavle</Cell>
            <Cell className={classes.headerCell}>Link</Cell>
            {shownColumns.map((column) => (
                <Cell className={classes.headerCell} key={column.name}>
                    {column.label}
                </Cell>
            ))}
            <Cell className={classes.headerCell} centered>
                Valg
            </Cell>
        </>
    )
}

export { TableHeader }
