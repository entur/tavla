import { TDepartureFragment } from 'graphql/index'
import {
    Columns,
    DefaultColumns,
    TColumn,
    TColumnSetting,
    TColumnSettingTest,
} from 'types/tile'
import React from 'react'
import classes from './styles.module.css'
import { DepartureContext } from './contexts'
import { Time } from './components/Time'
import { Destination } from './components/Destination'
import { Line } from './components/Line'
import { Platform } from './components/Platform'
import { Situations } from './components/Situations'
import { Via } from './components/Via'

/* const columnComponents: Record<TColumn, () => JSX.Element> = {
    destination: Destination,
    line: Line,
    time: Time,
    platform: Platform,
    via: Via,
    situations: Situations,
} */

const columnTest: Record<TColumn, TColumnSettingTest> = {
    line: { size: 10, selected: true },
    destination: { size: 20, selected: true },
    platform: { size: 15, selected: true },
    situations: { size: 40, selected: true },
    time: { size: 15, selected: false },
    via: { size: 15, selected: true },
}

function Table({ departures }: { departures: TDepartureFragment[] }) {
    return (
        <div className={classes.container}>
            <table className={classes.table}>
                <thead>
                    <tr>
                        <th
                            style={{
                                width: columnTest?.line.size + '%',
                            }}
                        >
                            Line
                        </th>
                        <th
                            style={{
                                width: columnTest?.destination.size + '%',
                            }}
                        >
                            Destinasjon
                        </th>
                        <th
                            style={{
                                width: columnTest?.platform.size + '%',
                            }}
                        >
                            Plattform
                        </th>
                        <th
                            style={{
                                width: columnTest?.situations.size + '%',
                            }}
                        >
                            Avvik
                        </th>
                        <th
                            style={{
                                width: columnTest?.time.size + '%',
                            }}
                        >
                            Avgangstid
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {departures.map((departure) => (
                        <tr
                            key={`${departure.serviceJourney.id}_${departure.aimedDepartureTime}`}
                        >
                            <DepartureContext.Provider value={departure}>
                                <Line />
                                <Destination />
                                {columnTest?.platform.selected && <Platform />}
                                <Situations />
                                <Time />
                            </DepartureContext.Provider>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export { Table }
