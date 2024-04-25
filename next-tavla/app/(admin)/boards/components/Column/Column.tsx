import { TBoardsColumn } from 'app/(admin)/utils/types'

function Column({
    column,
    children,
}: {
    column: TBoardsColumn
    children: React.ReactNode
}) {
    return (
        <div id={column} className="pl-2 min-h-[2.25rem] flex items-center">
            {children}
        </div>
    )
}

export { Column }
