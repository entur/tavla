function TableRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center h-em-3 border-t border-solid border-t-secondary">
            <div className="w-full mx-[0.25em]">{children}</div>
        </div>
    )
}

export { TableRow }
