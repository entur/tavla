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
                <div key={key} className={classes.addButton}>
                    <IconButton
                        onClick={() => {
                            addColumn(key)
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                    {Columns[key]}
                </div>
            ))}
        </div>
    )
}

export { AddColumn }
