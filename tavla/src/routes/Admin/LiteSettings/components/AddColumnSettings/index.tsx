import React, { useState } from 'react'
import { xor } from 'lodash'
import { Button } from '@entur/button'
import { Radio, RadioGroup } from '@entur/form'
import { Columns, TColumn } from '../../types/tile'

function AddColumnSettings({
    selectedColumns,
    addColumn,
}: {
    selectedColumns: TColumn[]
    addColumn: (column: TColumn) => void
}) {
    const [column, setColumn] = useState<TColumn | null>(null)

    return (
        <div
            style={{
                backgroundColor: 'var(--tavla-box-background-color)',
                padding: '1rem',
            }}
        >
            <RadioGroup
                name="new-column-settings"
                label="Velg kolonne"
                onChange={(e) => {
                    setColumn(e.target.value as TColumn)
                }}
                value={column}
            >
                {xor(selectedColumns, Object.keys(Columns) as TColumn[]).map(
                    (key) => (
                        <Radio key={key} value={key}>
                            {Columns[key]}
                        </Radio>
                    ),
                )}
            </RadioGroup>
            <Button
                variant="primary"
                disabled={!column}
                onClick={() => {
                    if (column) addColumn(column)
                    setColumn(null)
                }}
            >
                Legg til kolonne
            </Button>
        </div>
    )
}

export { AddColumnSettings }
