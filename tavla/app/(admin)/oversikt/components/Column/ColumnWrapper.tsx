import { TTableColumn } from 'app/(admin)/utils/types'

function ColumnWrapper({
    column,
    children,
}: {
    column: TTableColumn
    children: React.ReactNode
}) {
    return (
        <div
            id={column}
            className="table-custom-nth-child flex h-16 flex-row items-center pl-2"
        >
            {children}
        </div>
    )
}

export { ColumnWrapper }
