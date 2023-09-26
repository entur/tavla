import { useSortable } from '@dnd-kit/sortable'
import { DraggableIcon } from '@entur/icons'
import { TavlaButton } from './Button'

function SortableHandle({ id, ariaLabel }: { id: string; ariaLabel?: string }) {
    const { attributes, listeners } = useSortable({ id: id })

    return (
        <TavlaButton
            {...attributes}
            {...listeners}
            data-cy="sortable-handle"
            aria-label={ariaLabel}
        >
            <DraggableIcon size={16} />
        </TavlaButton>
    )
}

export { SortableHandle }
