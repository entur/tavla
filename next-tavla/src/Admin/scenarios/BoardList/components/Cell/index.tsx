import classes from './styles.module.css'

function Cell({
    className,
    children,
}: {
    children: React.ReactNode
    className?: string
}) {
    return <div className={`${classes.cell} ${className}`}>{children}</div>
}

export { Cell }
