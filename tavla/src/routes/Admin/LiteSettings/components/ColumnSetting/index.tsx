import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import classNames from 'classnames'
import { DeleteIcon, DraggableIcon } from '@entur/icons'
import { Columns, TColumn } from '../../types/tile'
import globals from '../../styles.module.css'
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
                <div className={globals.flexBetween}>
                    {Columns[column]}
                    <div className={globals.flexBetween}>
                        <button
                            className={globals.button}
                            onClick={deleteColumn}
                        >
                            <DeleteIcon size={16} />
                        </button>
                        <div
                            className={globals.button}
                            {...attributes}
                            {...listeners}
                            aria-label={column}
                        >
                            <DraggableIcon size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ColumnSetting }
