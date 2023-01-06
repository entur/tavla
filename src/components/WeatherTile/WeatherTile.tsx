import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useWeather } from '../../logic'
import { createAbortController } from '../../utils/utils'
import { useSettings } from '../../settings/SettingsProvider'
import { Tile } from '../Tile/Tile'
import { Temperature } from './Temperature/Temperature'
import { WeatherIcon } from './WeatherIcon/WeatherIcon'
import { Wind } from './Wind/Wind'
import { Precipitation } from './Precipitation/Precipitation'
import classes from './WeatherTile.module.scss'

const getWeatherDescriptionFromApi = async (
    iconName: string,
    signal?: AbortSignal,
): Promise<string> => {
    const weatherNameMatch = iconName.match(/.+?(?=_|$)/)
    if (!weatherNameMatch)
        return Promise.reject('No REGEX match found for ' + iconName)
    const url = `https://api.met.no/weatherapi/weathericon/2.0/legends`
    const response = await fetch(url, { signal })
    const weatherData = await response.json()
    return weatherData[weatherNameMatch.toString()].desc_nb
}

interface WeatherTileProps {
    className?: string
}

const IN_THREE_HOURS = 3

function WeatherTile(props: WeatherTileProps): JSX.Element {
    const weather = useWeather()
    const [settings] = useSettings()

    const [description, setDescription] = useState('')

    const weatherData = weather?.timeseries[IN_THREE_HOURS]

    useEffect(() => {
        const abortController = createAbortController()

        if (weatherData) {
            getWeatherDescriptionFromApi(
                weatherData.data.next_1_hours.summary.symbol_code,
                abortController.signal,
            )
                .then(setDescription)
                .catch((error) => {
                    if (error.name === 'AbortError') return
                    setDescription('')
                    throw error
                })
        }
        return () => {
            abortController.abort()
        }
    }, [weatherData])

    return (
        <Tile className={classNames(classes.WeatherTile, props.className)}>
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
                            description={description}
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
            <p tabIndex={0} className="uu-text">
                Været er {weatherData?.data.instant.details.air_temperature}{' '}
                grader og {description}
            </p>
        </Tile>
    )
}

export { WeatherTile }
