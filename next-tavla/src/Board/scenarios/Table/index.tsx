import { TDepartureFragment } from 'graphql/index'
import { Columns, TColumn, ColumnOrder, DefaultColumns } from 'types/column'
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

const columns = DefaultColumns

function Table({ departures }: { departures: TDepartureFragment[] }) {
    return (
        <div className={classes.container}>
            <table className={classes.table}>
                <thead>
                    <tr>
                        {ColumnOrder.map(
                            (col) =>
                                columns[col.type] && (
                                    <th
                                        style={{
                                            width: col.size,
                                        }}
                                        key={col.type}
                                    >
                                        {Columns[col.type]}
                                    </th>
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
