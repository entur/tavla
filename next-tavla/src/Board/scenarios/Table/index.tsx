import { TDepartureFragment } from 'graphql/index'
import { Columns, TColumn, DefaultColumns, TColumnOrder } from 'types/column'
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

const ColumnOrder: TColumnOrder = [
    { type: 'line', size: 1 },
    { type: 'destination', size: 2 },
    { type: 'via', size: 2 },
    { type: 'platform', size: 3 },
    { type: 'situations', size: 4 },
    { type: 'time', size: 1 },
]

const columns = DefaultColumns
function TH({ type, size }: { type: TColumn; size: number }) {
    return (
        <th
            style={{
                width: size,
            }}
        >
            {Columns[type]}
        </th>
    )
}

function Table({ departures }: { departures: TDepartureFragment[] }) {
    return (
        <div className={classes.container}>
            <table className={classes.table}>
                <thead>
                    <tr>
                        {ColumnOrder.map(
                            ({ type, size }) =>
                                columns[type] && (
                                    <TH type={type} size={size} key={type} />
                                ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {departures.map((departure) => (
                        <tr
                            key={`${departure.serviceJourney.id}_${departure.aimedDepartureTime}`}
                        >
                            <DepartureContext.Provider value={departure}>
                                {ColumnOrder.map((col) => {
                                    const Component = columnComponents[col.type]
                                    return (
                                        columns[col.type] && (
                                            <Component key={col.type} />
                                        )
                                    )
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
