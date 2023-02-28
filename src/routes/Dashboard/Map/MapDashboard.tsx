import React from 'react'
import { DashboardWrapper } from 'containers/DashboardWrapper/DashboardWrapper'
import { useStopPlaceIds } from 'hooks/use-stop-place-ids/useStopPlaceIds'
import { Map } from 'components/Map'
import { useSettings } from 'settings/SettingsProvider'
import { WeatherTile } from 'tiles/dashboard/WeatherTile'
import { DepartureTag } from './DepartureTag/DepartureTag'
import classes from './MapDashboard.module.scss'

function MapDashboard() {
    const [settings] = useSettings()
    const { stopPlaceIds } = useStopPlaceIds()

    const HEADER_MARGIN = 16
    //Used to calculate the height of the viewport for the map
    const headerHeight =
        (document?.getElementsByClassName('header')[0]?.clientHeight ?? 0) +
        HEADER_MARGIN
    return (
        <DashboardWrapper
            className={classes.MapDashboard}
            classes={{ Header: classes.Header, Byline: classes.Byline }}
        >
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
                    {stopPlaceIds.map((stopPlaceId) => (
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
