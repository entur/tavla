import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import globals from 'styles/global.module.css'
import { DraggableIcon } from '@entur/icons'

function SortableTileWrapper({
    id,
    children,
}: {
    id: string
    children: React.ReactNode
}) {
    const {
        setNodeRef,
        transform,
        transition,
        attributes,
        listeners,
        isDragging,
    } = useSortable({ id })

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
            <div
                className={globals.button}
                {...attributes}
                {...listeners}
                aria-label="TODO: tile endre rekkefolge"
            >
                <DraggableIcon size={16} />
            </div>
            {children}
        </div>
    )
}

export { SortableTileWrapper }
