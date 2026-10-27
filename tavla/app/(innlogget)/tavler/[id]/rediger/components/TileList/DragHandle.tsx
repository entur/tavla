import type {
    DraggableAttributes,
    DraggableSyntheticListeners,
} from '@dnd-kit/core'
import { DraggableIcon } from '@entur/icons'

export function DragHandle({
    attributes,
    listeners,
}: {
    attributes: DraggableAttributes
    listeners: DraggableSyntheticListeners
}) {
    return (
        <button
            {...attributes}
            {...listeners}
            aria-label="Flytt stoppested"
            className="cursor-grab touch-none *:!border-0 active:cursor-grabbing"
        >
            <DraggableIcon />
        </button>
    )
}
