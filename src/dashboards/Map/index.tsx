import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import {
    useStopPlacesWithDepartures,
    useBikeRentalStations,
    useWalkTime,
} from '../../logic'

import './styles.scss'
import MapView from './MapView'

const MapDashboard = ({ history }: Props): JSX.Element => {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const bikeRentalStations = useBikeRentalStations()
    const walkTimes = useWalkTime(stopPlacesWithDepartures)

    return (
        <DashboardWrapper
            className="map-tile"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            bikeRentalStations={bikeRentalStations}
        >
            <MapView
                bikeRentalStations={bikeRentalStations}
                stopPlacesWithDepartures={stopPlacesWithDepartures}
                walkTimes={walkTimes}
            ></MapView>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default MapDashboard
