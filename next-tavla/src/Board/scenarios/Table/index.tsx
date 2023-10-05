/* eslint-disable @typescript-eslint/no-unused-vars */
import { TDepartureFragment } from 'graphql/index'
import React from 'react'
import { Destination } from './components/Destination'
import { Line } from './components/Line'
import { Platform } from './components/Platform'
import classes from './styles.module.css'
import { DeparturesContext } from './contexts'
import { TColumn } from 'types/column'
import { isArray } from 'lodash'
import { RealTime } from './components/RealTime'
import { AimedTime } from './components/Time/components/AimedTime'
import { Time } from './components/Time/components/ExpectedTime'

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
                {columns.includes('line') && <Line />}
                {columns.includes('destination') && <Destination />}
                {columns.includes('platform') && <Platform />}
                {columns.includes('time') && <Time />}
                {columns.includes('realtime') && <RealTime />}
            </DeparturesContext.Provider>
        </div>
    )
}

export { Table }
