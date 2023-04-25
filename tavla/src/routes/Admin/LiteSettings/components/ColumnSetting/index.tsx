import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DraggableIcon } from '@entur/icons'
import classes from './styles.module.css'

function ColumnSetting({ column }: { column: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: column })

    const positionStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={{
                color: 'white',
                backgroundColor: '#292b6a',
                flex: 1,
                padding: '1rem',
                borderRadius: '0.5rem',
                ...positionStyle,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {column}
                <div className={classes.handle} {...attributes} {...listeners}>
                    <DraggableIcon />
                </div>
            </div>
        </div>
    )
}

export { ColumnSetting }
