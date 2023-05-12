import { TDeparture } from 'types/graphql'
import { Columns, TColumn, TColumnSetting } from 'types/tile'
import React from 'react'
import classes from './styles.module.css'
import { DepartureContext } from './contexts'
import { Time } from './components/Time'
import { Destination } from './components/Destination'
import { Line } from './components/Line'
import { Platform } from './components/Platform'

const columnComponents: Record<TColumn, () => JSX.Element> = {
    destination: Destination,
    line: Line,
    time: Time,
    platform: Platform,
}

function flexToPercentage(columnSettings: TColumnSetting[]) {
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

function Table({
    columns = [],
    departures,
}: {
    columns?: TColumnSetting[]
    departures: TDeparture[]
}) {
    const columnSizes = flexToPercentage(columns)

    return (
        <div className={classes.container}>
            <table className={classes.table}>
                <thead>
                    <tr>
                        {columnSizes.map((col) => (
                            <th
                                style={{
                                    width: col.size,
                                }}
                                key={col.type}
                            >
                                {Columns[col.type]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {departures.map((departure) => (
                        <tr
                            key={`${departure.serviceJourney.id}_${departure.aimedDepartureTime}`}
                        >
                            <DepartureContext.Provider value={departure}>
                                {columns.map((col) => {
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
