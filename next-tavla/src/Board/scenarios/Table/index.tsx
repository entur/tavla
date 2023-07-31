/* eslint-disable @typescript-eslint/no-unused-vars */
import { TDepartureFragment } from 'graphql/index'
import { DefaultColumns, TColumnSettings } from 'types/column'
import React from 'react'
import { Destination } from './components/Destination'
import { Line } from './components/Line'
import { Time } from './components/Time'
import { Platform } from './components/Platform'
import classes from './styles.module.css'
import { DeparturesContext } from './contexts'
import { Via } from './components/Via'

function Table({
    departures,
    columns,
}: {
    departures: TDepartureFragment[]
    columns?: TColumnSettings
}) {
    if (!columns) columns = DefaultColumns
    return (
        <div className={classes.table}>
            <DeparturesContext.Provider value={departures}>
                <Line />
                <Destination />
                {columns['via'] && <Via />}
                {columns['platform'] && <Platform />}
                <Time />
            </DeparturesContext.Provider>
        </div>
    )
}

export { Table }
