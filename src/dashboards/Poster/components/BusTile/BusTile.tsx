import React, { useMemo } from 'react'
import { compareAsc } from 'date-fns'
import { BusIcon } from '@entur/icons'
import { TransportMode } from '@entur/sdk'
import { useStopPlacesWithDepartures } from '../../../../logic'
import { useSettings } from '../../../../settings/SettingsProvider'
import './BusTile.scss'

function BusTile(): JSX.Element {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const [settings] = useSettings()
    const onlyBusShowing =
        settings?.hiddenModes.includes('sparkesykkel') &&
        settings?.hiddenModes.includes('delebil') &&
        settings?.hiddenModes.includes('bysykkel')

    function numberOfLines(): number {
        if (onlyBusShowing) {
            return 7
        }
        return 3
    }

    const busDepartures = useMemo(
        () =>
            stopPlacesWithDepartures
                ?.flatMap((stopPlace) => stopPlace.departures)
                .filter((departure) => departure.type === TransportMode.BUS)
                .sort((a, b) => compareAsc(a.departureTime, b.departureTime))
                .slice(0, numberOfLines()) ?? [],
        [stopPlacesWithDepartures],
    )

    return (
        <div className="poster-bus-tile">
            {busDepartures.map((departure) => {
                const routeNumber = departure.route.split(' ')[0]
                const routeDestination = departure.route
                    .split(' ')
                    .slice(1)
                    .join(' ')

                return (
                    <div key={departure.id} className="poster-bus-tile-row">
                        <div className="poster-bus-tile-route">
                            <BusIcon className="poster-bus-tile-icon" />
                            <span>{routeNumber}</span>
                        </div>
                        <p className="poster-bus-tile-destination">
                            {routeDestination}
                        </p>
                        <p className="poster-bus-tile-time">{departure.time}</p>
                    </div>
                )
            })}
        </div>
    )
}

export { BusTile }
