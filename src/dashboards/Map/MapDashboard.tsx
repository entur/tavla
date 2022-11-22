import React, { useMemo } from 'react'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import {
    useStopPlacesWithDepartures,
    useRentalStations,
    useWalkInfo,
    useMobility,
} from '../../logic'
import { useAllStopPlaceIds } from '../../logic/use-all-stop-place-ids/useAllStopPlaceIds'
import { Map } from '../../components/Map/Map'
import { useSettings } from '../../settings/SettingsProvider'
import { WeatherTile } from '../../components/WeatherTile/WeatherTile'
import { FormFactor } from '../../../graphql-generated/mobility-v2'
import { DepartureTag } from './DepartureTag/DepartureTag'
import classes from './MapDashboard.module.scss'

const MapDashboard = (): JSX.Element => {
    const [settings] = useSettings()

    const { allStopPlaceIds } = useAllStopPlaceIds()

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const bikeRentalStations = useRentalStations(
        true,
        FormFactor.Bicycle,
        settings.hiddenModes.includes('bysykkel'),
    )

    const walkInfoDestinations = useMemo(() => {
        if (!stopPlacesWithDepartures) return []
        return stopPlacesWithDepartures.map((dep) => ({
            ...dep,
            place: dep.id,
        }))
    }, [stopPlacesWithDepartures])
    const walkTimes = useWalkInfo(walkInfoDestinations)

    const scooters = useMobility(FormFactor.Scooter)
    const HEADER_MARGIN = 16
    //Used to calculate the height of the viewport for the map
    const headerHeight =
        (document?.getElementsByClassName('header')[0]?.clientHeight ?? 0) +
        HEADER_MARGIN
    return (
        <DashboardWrapper
            className={classes.MapDashboard}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            bikeRentalStations={bikeRentalStations}
        >
            <div
                style={{ height: `calc(100vh - ${headerHeight}px)` }}
                className={classes.Content}
            >
                <Map
                    scooters={scooters}
                    bikeRentalStations={bikeRentalStations}
                    stopPlaces={stopPlacesWithDepartures}
                    walkTimes={walkTimes}
                    interactive
                    latitude={settings.coordinates.latitude}
                    longitude={settings.coordinates.longitude}
                    zoom={settings.zoom}
                />
                {settings.showWeather && (
                    <div className={classes.WeatherDisplay}>
                        <WeatherTile className={classes.WeatherTileMap} />
                    </div>
                )}
                <div className={classes.DepartureDisplay}>
                    {allStopPlaceIds?.map((stopPlaceId) => (
                        <DepartureTag
                            key={stopPlaceId}
                            stopPlaceId={stopPlaceId}
                        />
                    ))}
                </div>
            </div>
        </DashboardWrapper>
    )
}

export { MapDashboard }
