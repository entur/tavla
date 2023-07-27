/* eslint-disable @typescript-eslint/no-unused-vars */
import { TDepartureFragment } from 'graphql/index'
import { TColumnSettings } from 'types/column'
import React from 'react'
import classes from './styles.module.css'
import { formatDateString, getRelativeTimeString } from 'utils/time'
import { TTransportMode } from 'types/graphql-schema'

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
        <div style={{ display: 'flex', fontSize: '2.5em', flexShrink: 0 }}>
            <Lines lines={lines} />
            <Destinations destinations={destinations} />
            <Platforms platforms={platforms} />
            <Times time={time} />
        </div>
    )
}

function Destinations({
    destinations,
}: {
    destinations: { destination: string; key: string }[]
}) {
    return (
        <div className={classes.tableColumn} style={{ flexGrow: 1 }}>
            <div className={classes.tableHeader}>Destinasjon</div>
            {destinations.map((destination) => (
                <div key={destination.key} className={classes.tableRow}>
                    <div className={classes.tableCell}>
                        {destination.destination}
                    </div>
                </div>
            ))}
        </div>
    )
}

function Lines({
    lines,
}: {
    lines: { transportMode: TTransportMode; publicCode: string; key: string }[]
}) {
    return (
        <div className={classes.tableColumn} style={{ flexShrink: 1 }}>
            <div className={classes.tableHeader}>Linje</div>
            {lines.map((line) => (
                <div
                    key={line.key}
                    className={classes.tableRow}
                    style={{ paddingTop: '0.3em', paddingBottom: '0.3em' }}
                >
                    <div
                        className={classes.tableCell}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            padding: '0.5em',
                            color: 'var(--main-background-color)',
                            backgroundColor: `var(--table-transport-${
                                line.transportMode ?? 'unknown'
                            }-color)`,
                            borderRadius: '0.2em',
                            fontWeight: 700,
                        }}
                    >
                        {line.publicCode}
                    </div>
                </div>
            ))}
        </div>
    )
}

function Times({
    time,
}: {
    time: {
        expectedDepartureTime: string
        aimedDepartureTime: string
        key: string
    }[]
}) {
    const Time = ({
        expectedDepartureTime,
        aimedDepartureTime,
    }: {
        expectedDepartureTime: string
        aimedDepartureTime: string
    }) => {
        const timeDeviation = Math.abs(
            (Date.parse(aimedDepartureTime) -
                Date.parse(expectedDepartureTime)) /
                1000,
        )
        if (timeDeviation > 120) {
            return (
                <div>
                    <div className={classes.expectedDepartureTime}>
                        {getRelativeTimeString(expectedDepartureTime)}
                    </div>
                    <div className={classes.aimedDepartureTime}>
                        {formatDateString(aimedDepartureTime)}
                    </div>
                </div>
            )
        }
        return (
            <div style={{ fontWeight: 600 }}>
                {getRelativeTimeString(expectedDepartureTime)}
            </div>
        )
    }

    return (
        <div className={classes.tableColumn} style={{ flexShrink: 1 }}>
            <div className={classes.tableHeader}>Avgang</div>
            {time.map((t) => (
                <div key={t.key} className={classes.tableRow}>
                    <div className={classes.tableCell}>
                        <Time
                            expectedDepartureTime={t.expectedDepartureTime}
                            aimedDepartureTime={t.aimedDepartureTime}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

function Platforms({
    platforms,
}: {
    platforms: { publicCode: string | null; key: string }[]
}) {
    return (
        <div className={classes.tableColumn}>
            <div className={classes.tableHeader}>Platform</div>
            {platforms.map((platform) => (
                <div key={platform.key} className={classes.tableRow}>
                    <div className={classes.tableCell}>
                        {platform.publicCode}
                    </div>
                </div>
            ))}
        </div>
    )
}

export { Table }
