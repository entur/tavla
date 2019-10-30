import React, { useState } from 'react'

import { useBikeRentalStations, useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import BikeTile from './BikeTile'
import DepartureTile from './DepartureTile'

// @ts-ignore
import errorImage from '../../assets/images/noStops.png'

import './styles.scss'

const EnturDashboard = ({ history }: Props): JSX.Element => {
    const [initialLoading] = useState<boolean>(false) // TODO: Fix loading

    const bikeRentalStations = useBikeRentalStations()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const noStops = !stopPlacesWithDepartures.length && (!bikeRentalStations || !bikeRentalStations.length)

    return (
        <DashboardWrapper className="enturdash" history={history}>
            {noStops && !initialLoading ? (
                <div className="no-stops">
                    <div className="no-stops-sheep">
                        <img src={errorImage} />
                    </div>
                </div>
            ) : (
                <div className="enturdash__tiles">
                    {
                        stopPlacesWithDepartures
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
            )}
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default EnturDashboard
