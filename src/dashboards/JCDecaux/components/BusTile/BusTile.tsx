import React, { useMemo } from 'react'
import { compareAsc } from 'date-fns'
import { BusIcon } from '@entur/icons'
import { TransportMode } from '@entur/sdk'
import { useStopPlacesWithDepartures } from '../../../../logic'
import './BusTile.scss'

function BusTile(): JSX.Element | null {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const busDepartures = useMemo(
        () =>
            stopPlacesWithDepartures
                ?.flatMap((stopPlace) => stopPlace.departures)
                .filter((departure) => departure.type === TransportMode.BUS)
                .sort((a, b) => compareAsc(a.departureTime, b.departureTime))
                .slice(0, 3) ?? [],
        [stopPlacesWithDepartures],
    )

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '2.5rem' }}>Neste buss</p>
            </div>
            <div
                className="available-vehicles-box"
                style={{
                    width: '90%',
                    display: 'inline-block',
                    height: '23%',
                    marginBottom: '10%',
                    padding: '1rem',
                }}
            >
                {busDepartures.map((departure) => {
                    const routeNumber = departure.route.split(' ')[0]
                    const routeDestination = departure.route
                        .split(' ')
                        .slice(1)
                        .join(' ')

                    return (
                        <div key={departure.id} className="row-box">
                            <div className="red-box">
                                <BusIcon
                                    color="white"
                                    style={{
                                        height: '4rem',
                                        width: '4rem',
                                        marginLeft: '1rem',
                                    }}
                                />
                                <p className="lineNumber">{routeNumber}</p>
                            </div>
                            <p className="stopPlace">{routeDestination}</p>
                            <p className="time">{departure.time}</p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export { BusTile }
