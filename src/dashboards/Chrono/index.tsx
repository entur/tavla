import React from 'react'

import { useBikeRentalStations, useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import BikeTile from './BikeTile'
import DepartureTile from './DepartureTile'

import './styles.scss'

const ChronoDashboard = ({ history }: Props): JSX.Element => {
    const bikeRentalStations = useBikeRentalStations()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    return (
        <DashboardWrapper
            className="chrono"
            history={history}
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="chrono__tiles">
                {
                    (stopPlacesWithDepartures || [])
                        .filter(({ departures }) => departures.length > 0)
                        .map((stop, index) => (
                            <DepartureTile
                                key={index}
                                stopPlaceWithDepartures={stop}
                            />
                        ))
                }
                {
                    bikeRentalStations && bikeRentalStations.length ? (
                        <BikeTile stations={bikeRentalStations} />
                    ) : null
                }
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default ChronoDashboard
