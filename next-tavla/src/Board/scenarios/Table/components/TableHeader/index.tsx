import classes from './styles.module.css'

function TableHeader({ heading }: { heading: string }) {
    return (
        <div className={classes.tableHeaderWrapper}>
            <h2>{heading}</h2>
        </div>
    )
}

export { TableHeader }
