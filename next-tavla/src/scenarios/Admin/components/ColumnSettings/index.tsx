import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS, type Transform } from '@dnd-kit/utilities'
import classNames from 'classnames'
import { Columns, TColumn, TColumnSetting } from 'types/tile'
import { DeleteIcon, AddIcon, SubtractIcon } from '@entur/icons'
import { IconButton } from '@entur/button'
import classes from './styles.module.css'
import { SortableHandle } from '../SortableHandle'

function restrictXScale(transform: Transform | null) {
    if (!transform) return undefined

    return CSS.Transform.toString({ ...transform, scaleX: 1 })
}

function increment(size: number | undefined) {
    if (!size) return 2
    return size + 1
}

function decrement(size: number | undefined) {
    if (!size) return 1
    if (size > 1) return size - 1
    return size
}

function ColumnSettings({
    column,
    updateColumn,
    removeColumn,
}: {
    column: TColumnSetting
    updateColumn: (newColumn: TColumnSetting) => void
    removeColumn: (column: TColumn) => void
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
            data-cy="column"
        >
            <div
                className={classNames(classes.column, {
                    [classes.dragging]: isDragging,
                })}
            >
                <div className="flexBetween">
                    {Columns[column.type]}
                    <div className="flexBetween">
                        <button
                            className="button"
                            onClick={() => removeColumn(column.type)}
                        >
                            <DeleteIcon size={16} />
                        </button>
                        <SortableHandle id={column.type} />
                    </div>
                </div>
                <div className={classes.sizeSettings}>
                    Størrelse:
                    <IconButton
                        onClick={() =>
                            updateColumn({
                                ...column,
                                size: decrement(column.size),
                            })
                        }
                    >
                        <SubtractIcon />
                    </IconButton>
                    {column.size ?? 1}
                    <IconButton
                        onClick={() =>
                            updateColumn({
                                ...column,
                                size: increment(column.size),
                            })
                        }
                    >
                        <AddIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export { ColumnSettings }
