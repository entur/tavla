import React from 'react'
import { xor } from 'lodash'
import { Columns, TColumn } from 'types/tile'
import { IconButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import classes from './styles.module.css'

function AddColumn({
    selectedColumns,
    addColumn,
}: {
    selectedColumns: TColumn[]
    addColumn: (column: TColumn) => void
}) {
    const remainingColumns = xor(
        selectedColumns,
        Object.keys(Columns) as TColumn[],
    )

    return (
        <div className={classes.column}>
            {remainingColumns.map((key) => (
                <IconButton
                    key={key}
                    onClick={() => {
                        addColumn(key)
                    }}
                >
                    <AddIcon />
                    {Columns[key]}
                </IconButton>
            ))}
        </div>
    )
}

export { AddColumn }
