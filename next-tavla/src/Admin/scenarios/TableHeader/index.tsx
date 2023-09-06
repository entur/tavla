import classes from './styles.module.css'

function TableHeader() {
    return (
        <div className={classes.tableHead}>
            <div className={classes.tableRow}>
                <div className={classes.tableCell}>Navn på tavle</div>
                <div className={classes.tableCell}>Link</div>
                <div className={classes.tableCell}>Valg</div>
            </div>
        </div>
    )
}

export { TableHeader }
