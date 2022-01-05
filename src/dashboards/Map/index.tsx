import React from 'react'

import { FormFactor } from '@entur/sdk/lib/mobility/types'

import DashboardWrapper from '../../containers/DashboardWrapper'
import {
    useStopPlacesWithDepartures,
    useBikeRentalStations,
    useWalkInfo,
    useMobility,
} from '../../logic'

import MapView from '../../components/Map'

import { useSettingsContext } from '../../settings'
import { DEFAULT_ZOOM } from '../../constants'

import WeatherTile from '../../components/WeatherTile'

import DepartureTag from './DepartureTag'
import './styles.scss'

const MapDashboard = (): JSX.Element => {
    const [settings] = useSettingsContext()

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const bikeRentalStations = useBikeRentalStations()
    const walkTimes = useWalkInfo(stopPlacesWithDepartures)
    const scooters = useMobility(FormFactor.SCOOTER)
    const HEADER_MARGIN = 16
    //Used to calculate the height of the viewport for the map
    const headerHeight =
        (document?.getElementsByClassName('header')[0]?.clientHeight ?? 0) +
        HEADER_MARGIN
    return (
        <DashboardWrapper
            className="map-view"
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            bikeRentalStations={bikeRentalStations}
        >
            <div
                style={{ height: `calc(100vh - ${headerHeight}px)` }}
                className="content"
            >
                <MapView
                    scooters={scooters}
                    bikeRentalStations={bikeRentalStations}
                    stopPlaces={stopPlacesWithDepartures}
                    walkTimes={walkTimes}
                    interactive
                    latitude={settings?.coordinates?.latitude ?? 0}
                    longitude={settings?.coordinates?.longitude ?? 0}
                    zoom={settings?.zoom ?? DEFAULT_ZOOM}
                />
                {settings?.showWeather && (
                    <div className="weather-display">
                        <WeatherTile className="weather-tile-map" />
                    </div>
                )}
                <div className="departure-display">
                    {stopPlacesWithDepartures?.map((stopPlace) => (
                        <DepartureTag
                            key={stopPlace.id}
                            stopPlace={stopPlace}
                        />
                    ))}
                </div>
            </div>
        </DashboardWrapper>
    )
}

export default MapDashboard
