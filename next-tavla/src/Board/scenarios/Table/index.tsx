/* eslint-disable @typescript-eslint/no-unused-vars */
import { TDepartureFragment } from 'graphql/index'
import React from 'react'
import { Destination } from './components/Destination'
import { Line } from './components/Line'
import { Time } from './components/Time'
import { Platform } from './components/Platform'
import classes from './styles.module.css'
import { DeparturesContext } from './contexts'
import { Via } from './components/Via'
import { TColumn } from 'types/column'
import { isArray } from 'lodash'

function Table({
    departures,
    columns,
    preview,
}: {
    departures: TDepartureFragment[]
    columns?: TColumn[]
    preview?: boolean
}) {
    if (!columns || !isArray(columns))
        return (
            <div className={classes.table}>
                Du har ikke lagt til noen kolonner enda
            </div>
        )
    const fontSize = preview ? '1rem' : `${2 - 0.05 * departures.length}rem`

    return (
        <div className={classes.table} style={{ fontSize }}>
            <DeparturesContext.Provider value={departures}>
                {columns.includes('line') && <Line />}
                {columns.includes('destination') && <Destination />}
                {columns.includes('via') && <Via />}
                {columns.includes('platform') && <Platform />}
                {columns.includes('time') && <Time />}
            </DeparturesContext.Provider>
        </div>
    )
}

export { Table }
