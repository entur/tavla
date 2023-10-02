import { CSSProperties } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function useSortableColumnAttributes(column: string) {
    const { attributes, listeners, transform, transition, active, setNodeRef } =
        useSortable({ id: column })

    const otherColumnActive = active && active.id !== column
    const thisColumnActive = active && active.id === column

    const activeStyle =
        thisColumnActive &&
        ({
            backgroundColor: 'var(--main-background-color)',
        } as CSSProperties)

    const style = {
        transform: CSS.Translate.toString(transform),
        transition: transition,
        zIndex: thisColumnActive ? 10 : 0,
        opacity: otherColumnActive ? 0.5 : 1,
        ...activeStyle,
    }

    if (thisColumnActive) style.backgroundColor = 'var(--main-background-color)'

    return {
        style,
        attributes,
        listeners,
        transform,
        transition,
        active,
        setNodeRef,
    }
}
