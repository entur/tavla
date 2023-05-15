import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

function SortableTileWrapper({
    id,
    children,
    setHandle,
}: {
    id: string
    children: React.ReactNode
    setHandle: Dispatch<
        SetStateAction<
            | {
                  attributes: DraggableAttributes
                  listeners: SyntheticListenerMap | undefined
              }
            | undefined
        >
    >
}): JSX.Element {
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

    useEffect(() => {
        setHandle({ attributes, listeners })
    }, [attributes, listeners, setHandle])

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
