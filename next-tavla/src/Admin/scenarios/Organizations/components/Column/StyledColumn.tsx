function StyledColumn({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div
            className={`flexRow alignCenter g-1 pr-4 h-rem-5 ${
                className ?? ''
            }`}
        >
            {children}
        </div>
    )
}

export { StyledColumn }
