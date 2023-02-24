import React from 'react'
import classNames from 'classnames'
import { useWeather } from 'hooks/useWeather'
import { useSettings } from 'settings/SettingsProvider'
import { Tile } from 'components/Tile'
import { Temperature } from './Temperature'
import { WeatherIcon } from './WeatherIcon'
import { Wind } from './Wind'
import { Precipitation } from './Precipitation'
import classes from './WeatherTile.module.scss'

const WEATHER_TIMESERIES_FORMATTING = 3

function WeatherTile({ className }: { className?: string }) {
    const weather = useWeather()
    const [settings] = useSettings()

    const weatherData = weather?.timeseries[WEATHER_TIMESERIES_FORMATTING]

    return (
        <Tile className={classNames(classes.WeatherTile, className)}>
            {(settings.showIcon || settings.showTemperature) && (
                <div className={classes.IconAndTemperature}>
                    {settings.showIcon && (
                        <WeatherIcon
                            symbolCode={
                                weatherData?.data.next_1_hours.summary
                                    .symbol_code
                            }
                        />
                    )}
                    {settings.showTemperature && (
                        <Temperature
                            description={weather?.description ?? ''}
                            temperature={
                                weatherData?.data.instant.details
                                    .air_temperature
                            }
                        />
                    )}
                </div>
            )}
            {(settings.showWind || settings.showPrecipitation) && (
                <div className={classes.WeatherDataContainer}>
                    {settings.showWind && (
                        <Wind
                            windSpeed={
                                weatherData?.data.instant.details.wind_speed
                            }
                            unit={weather?.meta.units.wind_speed}
                        />
                    )}
                    {settings.showPrecipitation && (
                        <Precipitation
                            precipitationAmount={
                                weatherData?.data.next_1_hours.details
                                    .precipitation_amount
                            }
                            precipitationUnit={
                                weather?.meta.units.precipitation_amount
                            }
                            probability={
                                weatherData?.data.next_1_hours.details
                                    .probability_of_precipitation
                            }
                            probabilityUnit={
                                weather?.meta.units.probability_of_precipitation
                            }
                        />
                    )}
                </div>
            )}
        </Tile>
    )
}

export { WeatherTile }
