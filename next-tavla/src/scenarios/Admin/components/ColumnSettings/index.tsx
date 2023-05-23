import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS, type Transform } from '@dnd-kit/utilities'
import classNames from 'classnames'
import { Columns, TColumnSetting } from 'types/tile'
import { DeleteIcon } from '@entur/icons'
import classes from './styles.module.css'
import { SortableHandle } from '../SortableHandle'

function restrictXScale(transform: Transform | null) {
    if (!transform) return undefined

    return CSS.Transform.toString({ ...transform, scaleX: 1 })
}

function ColumnSettings({
    column,
    deleteColumn,
}: {
    column: TColumnSetting
    deleteColumn: () => void
}) {
    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id: column.type,
    })

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
                        <SortableHandle id={column.type} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ColumnSettings }
