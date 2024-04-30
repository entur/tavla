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
            <div className="text-tertiary text-em-sm pb-2 ml-2 mr-2">
                {title}
            </div>
            {children}
        </div>
    )
}

export { TableColumn }
