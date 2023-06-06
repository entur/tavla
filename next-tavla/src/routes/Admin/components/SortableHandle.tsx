import { useSortable } from '@dnd-kit/sortable'
import { DraggableIcon } from '@entur/icons'

function SortableHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({ id: id })

    return (
        <div
            className="button"
            {...attributes}
            {...listeners}
            aria-label="TODO: tile endre rekkefolge"
            data-cy="sortable-handle"
        >
            <DraggableIcon size={16} />
        </div>
    )
}

export { SortableHandle }
