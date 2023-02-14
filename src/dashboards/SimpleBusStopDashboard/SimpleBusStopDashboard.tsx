import React, { useState } from 'react'
import { BikeTile } from '../../components/BikeTile/BikeTile'
import { Tile } from '../../components/Tile/Tile'
import { Temperature } from '../../components/WeatherTile/Temperature/Temperature'
import { WeatherIcon } from '../../components/WeatherTile/WeatherIcon/WeatherIcon'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { useWeather } from '../../logic'
import { useStopPlaceIds } from '../../logic/use-stop-place-ids/useStopPlaceIds'
import { BusStopTile } from '../../components/BusStop/BusStopTile/BusStopTile'
import classes from './SimpleBusStopDashboard.module.scss'

const SimpleBusStopDashboard = (): JSX.Element => {
    const { stopPlaceIds } = useStopPlaceIds({ numberOfStations: 1 })
    const weather = useWeather()
    const IN_THREE_HOURS = 3
    const [description] = useState('')
    const weatherData = weather?.timeseries[IN_THREE_HOURS]

    return (
        <DashboardWrapper className="">
            <div className={classes.Wrapper}>
                {stopPlaceIds.map((stopPlaceId) => (
                    <BusStopTile
                        stopPlaceId={stopPlaceId}
                        deviationUnder={true}
                        key={stopPlaceId}
                        className={classes.SimpleStopTile}
                    />
                ))}
                <div className={classes.RightPriceTile}>
                    <Tile className={classes.NewWeatherTile}>
                        <WeatherIcon
                            symbolCode={
                                weatherData?.data.next_1_hours.summary
                                    .symbol_code
                            }
                        />
                        <Temperature
                            description={description}
                            temperature={
                                weatherData?.data.instant.details
                                    .air_temperature
                            }
                        />
                    </Tile>
                    <BikeTile className={classes.BikeTile}></BikeTile>
                </div>
            </div>
        </DashboardWrapper>
    )
}

export { SimpleBusStopDashboard }
