import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS, type Transform } from '@dnd-kit/utilities'
import classNames from 'classnames'
import { Columns, TColumnSetting } from 'types/tile'
// import globals from 'styles/global.module.css'
import { DeleteIcon, DraggableIcon } from '@entur/icons'
import classes from './styles.module.css'

function restrictXScale(transform: Transform | null) {
    if (!transform) return undefined

    return CSS.Transform.toString({ ...transform, scaleX: 1 })
}

function ColumnSetting({
    column,
    deleteColumn,
}: {
    column: TColumnSetting
    deleteColumn: () => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column.type })

    const positionStyle = {
        transform: restrictXScale(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        flex: column.size,
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
                <div className="flexBetween">
                    {Columns[column.type]}
                    <div className="flexBetween">
                        <button className="button" onClick={deleteColumn}>
                            <DeleteIcon size={16} />
                        </button>
                        <div
                            className="button"
                            {...attributes}
                            {...listeners}
                            aria-label={column.type}
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
