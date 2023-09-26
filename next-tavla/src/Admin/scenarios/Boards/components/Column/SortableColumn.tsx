import { useSortable } from '@dnd-kit/sortable'
import { TBoardsColumn } from 'Admin/types/boards'
import { CSS } from '@dnd-kit/utilities'

function SortableColumn({
    column,
    children,
    className,
}: {
    column: TBoardsColumn
    children: React.ReactNode
    className?: string
}) {
    const { setNodeRef, transform, transition } = useSortable({ id: column })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} id={column} className={className}>
            {children}
        </div>
    )
}

export { SortableColumn }
