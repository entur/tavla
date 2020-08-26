import React, { useEffect } from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { useStopPlacesWithDepartures } from '../../logic'
import StopPlacePanel from '../../containers/Admin/EditTab/StopPlacePanel'

import { timeUntil, useCounter } from '../../utils'

import StationTile from './StationTile'
import ScooterTile from './ScooterTile'

import './styles.scss'

function getStationviewLabel(expectedDepartureTime: string): string {
    const secondsUntilDeparture = timeUntil(expectedDepartureTime)
    let minutesUntilDeparture = Math.floor(secondsUntilDeparture / 60)
    return `${minutesUntilDeparture} min`
}

function Stationview({ history }: Props): JSX.Element {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    return (
        <DashboardWrapper
            className="stationview"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            {/* {(stopPlacesWithDepartures || []).map((stopPlace) => {
                return (
                    <div key={stopPlace.id}>
                        {(stopPlace.departures || []).map((departure) => (
                            <p key={departure.id}>
                                {`${departure.route}: ${getStationviewLabel(
                                    departure.expectedDepartureTime,
                                )}`}
                            </p>
                        ))}
                        {(stopPlacesWithDepartures || []).map((stop, index) => (
                            <StationTile
                                key={index}
                                stopPlaceWithDepartures={stop}
                            />
                        ))}

                    </div>
                    
                )
            })} */}
            <ScooterTile />
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default Stationview
