import { useSortable } from '@dnd-kit/sortable'
import { DraggableIcon } from '@entur/icons'
import { TavlaButton } from './Button'

function SortableHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({ id: id })

    return (
        <TavlaButton
            {...attributes}
            {...listeners}
            aria-label="TODO: tile endre rekkefolge"
            data-cy="sortable-handle"
        >
            <DraggableIcon size={16} />
        </TavlaButton>
    )
}

export { SortableHandle }
