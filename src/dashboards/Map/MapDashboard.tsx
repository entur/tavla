import React from 'react'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { useAllStopPlaceIds } from '../../logic/use-all-stop-place-ids/useAllStopPlaceIds'
import { Map } from '../../components/Map/Map'
import { useSettings } from '../../settings/SettingsProvider'
import { WeatherTile } from '../../components/WeatherTile/WeatherTile'
import { DepartureTag } from './DepartureTag/DepartureTag'
import classes from './MapDashboard.module.scss'

const MapDashboard = (): JSX.Element => {
    const [settings] = useSettings()
    const { allStopPlaceIds } = useAllStopPlaceIds()

    const HEADER_MARGIN = 16
    //Used to calculate the height of the viewport for the map
    const headerHeight =
        (document?.getElementsByClassName('header')[0]?.clientHeight ?? 0) +
        HEADER_MARGIN
    return (
        <DashboardWrapper className={classes.MapDashboard}>
            <div
                style={{ height: `calc(100vh - ${headerHeight}px)` }}
                className={classes.Content}
            >
                <Map />
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
