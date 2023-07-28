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

function TableColumn({
    title,
    children,
    className,
}: {
    title: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`${classes.tableColumn} ${className}`}>
            <div className={classes.tableHeader}>{title}</div>
            {children}
        </div>
    )
}

function TableRow({ children }: { children: React.ReactNode }) {
    return (
        <div className={classes.tableRow}>
            <div className={classes.tableCell}>{children}</div>
        </div>
    )
}

function Destinations({
    destinations,
}: {
    destinations: { destination: string; key: string }[]
}) {
    return (
        <TableColumn title="Destinasjon" className={classes.grow}>
            {destinations.map((destination) => (
                <TableRow key={destination.key}>
                    {destination.destination}
                </TableRow>
            ))}
        </TableColumn>
    )
}

function Lines({
    lines,
}: {
    lines: { transportMode: TTransportMode; publicCode: string; key: string }[]
}) {
    const Line = ({
        transportMode,
        publicCode,
    }: {
        transportMode: TTransportMode
        publicCode: string
    }) => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                padding: '0.5em',
                color: 'var(--main-background-color)',
                backgroundColor: `var(--table-transport-${
                    transportMode ?? 'unknown'
                }-color)`,
                borderRadius: '0.2em',
                fontWeight: 700,
            }}
        >
            {publicCode}
        </div>
    )

    return (
        <TableColumn title="Linje">
            {lines.map((line) => (
                <TableRow key={line.key}>
                    <Line
                        transportMode={line.transportMode}
                        publicCode={line.publicCode}
                    />
                </TableRow>
            ))}
        </TableColumn>
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
        <TableColumn title="Avgang">
            {time.map((t) => (
                <TableRow key={t.key}>
                    <Time
                        expectedDepartureTime={t.expectedDepartureTime}
                        aimedDepartureTime={t.aimedDepartureTime}
                    />
                </TableRow>
            ))}
        </TableColumn>
    )
}

function Platforms({
    platforms,
}: {
    platforms: { publicCode: string | null; key: string }[]
}) {
    return (
        <TableColumn title="Platform">
            {platforms.map((platform) => (
                <TableRow key={platform.key}>{platform.publicCode}</TableRow>
            ))}
        </TableColumn>
    )
}

export { Table }
