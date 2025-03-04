import { TTableColumn } from 'app/(admin)/utils/types'

function Column({
    column,
    children,
}: {
    column: TTableColumn
    children: React.ReactNode
}) {
    return (
        <div
            id={column}
            className="pl-2 flex flex-row items-center h-16 table-custom-nth-child"
        >
            {children}
        </div>
    )
}

export { Column }
