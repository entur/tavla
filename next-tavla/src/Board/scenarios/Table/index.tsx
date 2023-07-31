/* eslint-disable @typescript-eslint/no-unused-vars */
import { TDepartureFragment } from 'graphql/index'
import { TColumnSettings } from 'types/column'
import React from 'react'
import { Destination } from './components/Destination'
import { Line } from './components/Line'
import { Time } from './components/Time'
import { Platform } from './components/Platform'
import classes from './styles.module.css'
import { DeparturesContext } from './contexts'

function Table({
    departures,
    columns,
}: {
    departures: TDepartureFragment[]
    columns?: TColumnSettings
}) {
    return (
        <div className={classes.table}>
            <DeparturesContext.Provider value={departures}>
                <Line />
                <Destination />
                <Platform />
                <Time />
            </DeparturesContext.Provider>
        </div>
    )
}

export { Table }
