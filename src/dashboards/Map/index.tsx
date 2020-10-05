import React, { useMemo } from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { useStopPlacesWithDepartures, useBikeRentalStations } from '../../logic'

import './styles.scss'
import MapView from './MapView'

const MapDashboard = ({ history }: Props): JSX.Element => {
    const stopPlacesForMemo = useStopPlacesWithDepartures()
    const stopPlacesWithDepartures = useMemo(() => stopPlacesForMemo, [
        stopPlacesForMemo,
    ])
    const bikeRentalStationsForMemo = useBikeRentalStations()
    const bikeRentalStations = useMemo(() => bikeRentalStationsForMemo, [
        bikeRentalStationsForMemo,
    ])

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
            ></MapView>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default MapDashboard
