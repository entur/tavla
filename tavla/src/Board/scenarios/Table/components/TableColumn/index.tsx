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
        <div className={`flex flex-col ${className}`}>
            <div className="mx-2 pb-2 text-em-sm/em-base text-primary">
                {title}
            </div>
            {children}
        </div>
    )
}

export { TableColumn }
