import classes from './styles.module.css'

function TableHeader() {
    return (
        <div className={classes.tableHead}>
            <div className={classes.tableHeaderRow}>
                <div className={classes.tableHeaderCell}>Navn på tavle</div>
                <div className={classes.tableHeaderCell}>Link</div>
                <div
                    className={`${classes.tableHeaderCell} ${classes.tableHeaderOptionsCell}`}
                >
                    Valg
                </div>
            </div>
        </div>
    )
}

export { TableHeader }
