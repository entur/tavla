import React, { useMemo } from 'react'
import { FormFactor } from '@entur/sdk/lib/mobility/types'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import {
    useStopPlacesWithDepartures,
    useRentalStations,
    useWalkInfo,
    useMobility,
} from '../../logic'
import { Map } from '../../components/Map/Map'
import { useSettings } from '../../settings/SettingsProvider'
import { DEFAULT_ZOOM } from '../../constants'
import { WeatherTile } from '../../components/WeatherTile/WeatherTile'
import { DepartureTag } from './DepartureTag/DepartureTag'
import './MapDashboard.scss'

const MapDashboard = (): JSX.Element => {
    const [settings] = useSettings()

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const bikeRentalStations = useRentalStations()

    const walkInfoDestinations = useMemo(() => {
        if (!stopPlacesWithDepartures) return []
        return stopPlacesWithDepartures.map((dep) => ({
            ...dep,
            place: dep.id,
        }))
    }, [stopPlacesWithDepartures])
    const walkTimes = useWalkInfo(walkInfoDestinations)

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
                <Map
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

export { MapDashboard }
