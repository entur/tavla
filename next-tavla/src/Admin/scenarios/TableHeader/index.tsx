import { Cell } from '../BoardList/components/Cell'
import classes from './styles.module.css'

function TableHeader() {
    return (
        <>
            <Cell className={classes.headerCell}>Navn på tavle</Cell>
            <Cell className={classes.headerCell}>Link</Cell>
            <Cell className={classes.headerCell}>Transportmetoder</Cell>
            <Cell className={classes.headerCell} centered>
                Valg
            </Cell>
        </>
    )
}

export { TableHeader }
