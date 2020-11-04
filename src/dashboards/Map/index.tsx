import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import {
    useStopPlacesWithDepartures,
    useBikeRentalStations,
    useWalkTime,
    useScooters,
} from '../../logic'

import MapView from '../../components/Map'

import './styles.scss'
import { useSettingsContext } from '../../settings'
import { DEFAULT_ZOOM } from '../../constants'

import DepartureTag from './DepartureTag'
const MapDashboard = ({ history }: Props): JSX.Element => {
    const [settings] = useSettingsContext()

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const bikeRentalStations = useBikeRentalStations()
    const walkTimes = useWalkTime(stopPlacesWithDepartures)
    const scooters = useScooters()
    const HEADER_MARGIN = 16
    //Used to calculate the height of the viewport for the map
    const headerHeight =
        (document?.getElementsByClassName('header')[0]?.clientHeight ?? 0) +
        HEADER_MARGIN
    return (
        <DashboardWrapper
            className="map-view"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            bikeRentalStations={bikeRentalStations}
        >
            <div style={{ height: `calc(100vh - ${headerHeight}px)` }}>
                <MapView
                    scooters={scooters}
                    bikeRentalStations={bikeRentalStations}
                    stopPlaces={stopPlacesWithDepartures}
                    walkTimes={walkTimes}
                    interactive={true}
                    latitude={settings?.coordinates?.latitude ?? 0}
                    longitude={settings?.coordinates?.longitude ?? 0}
                    zoom={settings?.zoom ?? DEFAULT_ZOOM}
                ></MapView>
                <div className="departure-display">
                    {stopPlacesWithDepartures?.map((stopPlace) =>
                        stopPlace.departures.length ? (
                            <DepartureTag
                                key={stopPlace.id}
                                stopPlace={stopPlace}
                            ></DepartureTag>
                        ) : (
                            []
                        ),
                    )}
                </div>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default MapDashboard
