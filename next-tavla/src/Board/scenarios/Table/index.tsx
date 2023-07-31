/* eslint-disable @typescript-eslint/no-unused-vars */
import { TDepartureFragment } from 'graphql/index'
import { TColumnSettings } from 'types/column'
import React from 'react'
import { Destination } from './components/Destination'
import { Line } from './components/Line'
import { Time } from './components/Time'
import { Platform } from './components/Platform'
import classes from './styles.module.css'

function Table({
    departures,
    columns,
}: {
    departures: TDepartureFragment[]
    columns?: TColumnSettings
}) {
    const destinations = departures.map((departure) => ({
        destination: departure.destinationDisplay?.frontText ?? '',
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    const lines = departures.map((departure) => ({
        transportMode: departure.serviceJourney.transportMode ?? 'unknown',
        publicCode: departure.serviceJourney.line.publicCode ?? '',
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    const time = departures.map((departure) => ({
        aimedDepartureTime: departure.aimedDepartureTime,
        expectedDepartureTime: departure.expectedDepartureTime,
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    const platforms = departures.map((departure) => ({
        publicCode: departure.quay.publicCode,
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <div className={classes.table}>
            <Line lines={lines} />
            <Destination destinations={destinations} />
            <Platform platforms={platforms} />
            <Time time={time} />
        </div>
    )
}

export { Table }
