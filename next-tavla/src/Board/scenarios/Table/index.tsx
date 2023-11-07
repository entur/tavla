/* eslint-disable @typescript-eslint/no-unused-vars */
import { TDepartureFragment } from 'graphql/index'
import React from 'react'
import { Destination } from './components/Destination'
import classes from './styles.module.css'
import { DeparturesContext } from './contexts'
import { TColumn } from 'types/column'
import { isArray } from 'lodash'
import { RealTime } from './components/RealTime'
import { AimedTime } from './components/Time/AimedTime'
import { ArrivalTime } from './components/Time/ArrivalTime'
import { Platform } from './components/Platform'
import { ExpectedTime } from './components/Time/ExpectedTime'
import { Deviation } from './components/Deviation'
import { Line } from './components/Line'

function Table({
    departures,
    columns,
}: {
    departures: TDepartureFragment[]
    columns?: TColumn[]
}) {
    if (!columns || !isArray(columns))
        return (
            <div className={classes.table}>
                Du har ikke lagt til noen kolonner enda
            </div>
        )

    return (
        <div className={classes.table}>
            <DeparturesContext.Provider value={departures}>
                {columns.includes('aimedTime') && <AimedTime />}
                {columns.includes('arrivalTime') && <ArrivalTime />}
                {columns.includes('publicCode') && <Line />}
                {columns.includes('destination') && (
                    <Destination deviations={!columns.includes('deviations')} />
                )}
                {columns.includes('deviations') && <Deviation />}
                {columns.includes('platform') && <Platform />}
                {columns.includes('time') && <ExpectedTime />}
                {columns.includes('realtime') && <RealTime />}
            </DeparturesContext.Provider>
        </div>
    )
}

export { Table }
