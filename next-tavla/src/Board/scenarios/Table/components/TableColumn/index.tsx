import classes from './styles.module.css'

function TableColumn({
    title,
    children,
    className,
}: {
    title: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`${classes.tableColumn} ${className}`}>
            <div className={classes.tableHeader}>{title}</div>
            {children}
        </div>
    )
}

export { TableColumn }
