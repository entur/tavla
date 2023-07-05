import { TDepartureFragment } from 'graphql/index'
import { Columns, TColumn, TColumnSettingTest } from 'types/tile'
import React from 'react'
import classes from './styles.module.css'
import { DepartureContext } from './contexts'
import { Time } from './components/Time'
import { Destination } from './components/Destination'
import { Line } from './components/Line'
import { Platform } from './components/Platform'
import { Situations } from './components/Situations'
import { Via } from './components/Via'

const columnTest: Record<TColumn, TColumnSettingTest> = {
    line: { size: 10, selected: true },
    destination: { size: 20, selected: true },
    platform: { size: 15, selected: false },
    situations: { size: 40, selected: true },
    time: { size: 15, selected: false },
    via: { size: 15, selected: true },
}

const columnComponents: Record<TColumn, () => JSX.Element> = {
    destination: Destination,
    line: Line,
    time: Time,
    platform: Platform,
    situations: Situations,
    via: Via,
}

const columnOrder: TColumn[] = [
    'line',
    'destination',
    'platform',
    'situations',
    'time',
]

function Table({ departures }: { departures: TDepartureFragment[] }) {
    return (
        <div className={classes.container}>
            <table className={classes.table}>
                <thead>
                    <tr>
                        {columnOrder.map(
                            (colName) =>
                                columnTest[colName].selected && (
                                    <th
                                        style={{
                                            width: columnTest[colName].size,
                                        }}
                                        key={colName}
                                    >
                                        {Columns[colName]}
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
                                {columnOrder.map((colName) => {
                                    const Component = columnComponents[colName]
                                    return (
                                        columnTest[colName].selected && (
                                            <Component key={colName} />
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
