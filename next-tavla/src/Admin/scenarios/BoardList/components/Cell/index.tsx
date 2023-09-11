import classes from './styles.module.css'

function Cell({
    className,
    children,
    centered,
}: {
    children: React.ReactNode
    className?: string
    centered?: boolean
}) {
    return (
        <div
            className={`${classes.cell} ${
                centered && classes.centeredCell
            } ${className}`}
        >
            {children}
        </div>
    )
}

export { Cell }
