import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS, type Transform } from '@dnd-kit/utilities'
import classNames from 'classnames'
import { Columns, TColumn, TColumnSetting } from 'types/tile'
import { DeleteIcon, AddIcon, SubtractIcon } from '@entur/icons'
import { IconButton } from '@entur/button'
import classes from './styles.module.css'
import { SortableHandle } from '../../components/SortableHandle'
import { TavlaButton } from 'Admin/components/Button'

function restrictXScale(transform: Transform | null) {
    if (!transform) return undefined

    return CSS.Transform.toString({ ...transform, scaleX: 1 })
}

function increment(size = 1) {
    return size + 1
}

function decrement(size = 1) {
    return Math.max(1, size - 1)
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
                        <TavlaButton
                            aria-label={'Fjern kolonne'}
                            onClick={() => removeColumn(column.type)}
                        >
                            <DeleteIcon size={16} />
                        </TavlaButton>
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
