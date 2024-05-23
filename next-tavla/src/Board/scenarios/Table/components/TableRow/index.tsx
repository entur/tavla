function TableRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center h-em-3 border-t border-solid border-t-secondary">
            <div className="w-full mx-em-0.25">{children}</div>
        </div>
    )
}

export { TableRow }
