import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { useStopPlacesWithDepartures } from '../../logic'
import { timeUntil, useCounter } from '../../utils'

function getSooonLabel(expectedDepartureTime: string): string {
    const secondsUntilDeparture = timeUntil(expectedDepartureTime)
    return 'Soo'.padEnd(secondsUntilDeparture, 'o') + 'n'
}

function Sooon({ history }: Props): JSX.Element {
    useCounter()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    return (
        <DashboardWrapper
            className="sooon"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            { (stopPlacesWithDepartures || []).map(stopPlace => {
                return (
                    <div key={stopPlace.id}>
                        <h2>{stopPlace.name}</h2>
                        { (stopPlace.departures || []).map(departure => (
                            <p key={departure.id}>
                                { `${departure.route}: ${getSooonLabel(departure.expectedDepartureTime)}` }
                            </p>
                        )) }
                    </div>
                )
            }) }
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default Sooon