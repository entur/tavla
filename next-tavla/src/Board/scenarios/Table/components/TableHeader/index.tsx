import classes from './styles.module.css'

function TableHeader({ heading }: { heading: string }) {
    return (
        <div className={classes.tableHeaderWrapper}>
            <h1 className={classes.heading}>{heading}</h1>
        </div>
    )
}

export { TableHeader }
