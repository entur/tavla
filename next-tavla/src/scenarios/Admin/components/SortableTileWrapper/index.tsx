import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableTileWrapper({
    id,
    children,
}: {
    id: string
    children: React.ReactNode
}): JSX.Element {
    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    })

    const positionStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
    }

    return (
        <div
            ref={setNodeRef}
            style={{ ...positionStyle, position: 'relative' }}
        >
            {children}
        </div>
    )
}

export { SortableTileWrapper }
