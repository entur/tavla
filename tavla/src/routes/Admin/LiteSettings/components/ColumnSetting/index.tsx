import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import classNames from 'classnames'
import { DeleteIcon, DraggableIcon } from '@entur/icons'
import { TColumn } from '../../types/tile'
import classes from './styles.module.css'

function ColumnSetting({
    column,
    deleteColumn,
}: {
    column: TColumn
    deleteColumn: () => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column })

    const positionStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
    }

    return (
        <div
            ref={setNodeRef}
            style={positionStyle}
            className={classes.dragContainer}
        >
            <div
                className={classNames(classes.column, {
                    [classes.dragging]: isDragging,
                })}
            >
                <div className={classes.flexBetween}>
                    {column}
                    <div
                        className={classes.handle}
                        {...attributes}
                        {...listeners}
                        aria-label={column}
                    >
                        <DraggableIcon />
                    </div>
                    <button onClick={deleteColumn}>
                        <DeleteIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export { ColumnSetting }
