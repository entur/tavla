import classes from './styles.module.css'

function TableRow({ children }: { children: React.ReactNode }) {
    return (
        <div className={classes.tableRow}>
            <div className={classes.tableCell}>{children}</div>
        </div>
    )
}

export { TableRow }
