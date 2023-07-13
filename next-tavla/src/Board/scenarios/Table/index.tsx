import { TDepartureFragment } from 'graphql/index'
import {
    Columns,
    TColumn,
    DefaultColumns,
    TColumnLayout,
    TColumnSettings,
} from 'types/column'
import React from 'react'
import classes from './styles.module.css'
import { DepartureContext } from './contexts'
import { Time } from './components/Time'
import { Destination } from './components/Destination'
import { Line } from './components/Line'
import { Platform } from './components/Platform'
import { Situations } from './components/Situations'
import { Via } from './components/Via'

const columnComponents: Record<TColumn, () => JSX.Element> = {
    destination: Destination,
    line: Line,
    time: Time,
    platform: Platform,
    situations: Situations,
    via: Via,
}

const ColumnOrder: TColumnLayout[] = [
    { type: 'line', size: 1, textalign: true },
    { type: 'destination', size: 2, textalign: true },
    { type: 'via', size: 2, textalign: true },
    { type: 'platform', size: 3, textalign: true },
    { type: 'situations', size: 4, textalign: true },
    { type: 'time', size: 1, textalign: false },
]

function ColumnTableHeader({ type, size, textalign }: TColumnLayout) {
    const textAlign = textalign ? 'left' : 'right'
    return (
        <th
            className={classes.header}
            style={{
                width: size,
                textAlign,
            }}
        >
            {Columns[type]}
        </th>
    )
}

function Table({
    departures,
    columns,
}: {
    departures: TDepartureFragment[]
    columns?: TColumnSettings
}) {
    const mergedColumns = { ...DefaultColumns, ...columns }

    const filteredColumnOrder = ColumnOrder.filter(
        ({ type }) => mergedColumns[type],
    )

    return (
        <div className={classes.container}>
            <table className={classes.table}>
                <thead>
                    <tr>
                        {filteredColumnOrder.map((props) => (
                            <ColumnTableHeader key={props.type} {...props} />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {departures.map((departure) => (
                        <tr
                            key={`${departure.serviceJourney.id}_${departure.aimedDepartureTime}`}
                        >
                            <DepartureContext.Provider value={departure}>
                                {filteredColumnOrder.map((col) => {
                                    const Component = columnComponents[col.type]
                                    return <Component key={col.type} />
                                })}
                            </DepartureContext.Provider>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export { Table }
