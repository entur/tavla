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

const columnComponents: Record<TColumn, () => JSX.Element | null> = {
    destination: Destination,
    line: Line,
    time: Time,
    platform: Platform,
    situations: Situations,
    via: Via,
}

const ColumnOrder: TColumnLayout[] = [
    { type: 'line', size: 3 },
    { type: 'destination', size: 10 },
    { type: 'via', size: 5 },
    { type: 'situations', size: 6 },
    { type: 'platform', size: 1 },
    { type: 'time', size: 4 },
]

function flexToPercentage(columnSettings: TColumnLayout[]) {
    const flexToPercentage = columnSettings.reduce(
        (acc, val) => acc + (val.size ?? 1),
        0,
    )

    const perc = 100 / flexToPercentage

    return columnSettings.map((set) => ({
        ...set,
        size: (set.size ?? 1) * perc,
    }))
}

function ColumnTableHeader({ type, size }: TColumnLayout) {
    return (
        <th
            className={classes.header}
            style={{
                width: size,
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

    const formattedColumnOrder = flexToPercentage(
        ColumnOrder.filter(({ type }) => mergedColumns[type]),
    )

    return (
        <div className={classes.container}>
            <table className={classes.table}>
                <thead className={classes.row}>
                    <tr>
                        {formattedColumnOrder.map((props) => (
                            <ColumnTableHeader key={props.type} {...props} />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {departures.map((departure) => (
                        <tr
                            className={classes.row}
                            key={`${departure.serviceJourney.id}_${departure.aimedDepartureTime}`}
                        >
                            <DepartureContext.Provider value={departure}>
                                {formattedColumnOrder.map((col) => {
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
