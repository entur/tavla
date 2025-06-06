function TableRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center border-t border-solid border-t-secondary">
            <div className="mx-em-0.25 w-full">{children}</div>
        </div>
    )
}

export { TableRow }
