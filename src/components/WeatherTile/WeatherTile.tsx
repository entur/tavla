import React, { useEffect, useState } from 'react'
import { useWeather } from '../../logic'
import { createAbortController } from '../../utils'
import { useSettings } from '../../settings/SettingsProvider'
import { Temperature } from './Temperature'
import { WeatherIcon } from './WeatherIcon'
import { Wind } from './Wind'
import { Precipitation } from './Precipitation'
import './WeatherTile.scss'

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

    const {
        showIcon = true,
        showTemperature = true,
        showWind = true,
        showPrecipitation = true,
    } = settings || {}

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
        <div className={'weather-tile ' + props.className}>
            {(showIcon || showTemperature) && (
                <div className="weather-tile__icon-and-temperature">
                    {showIcon && (
                        <WeatherIcon
                            symbolCode={
                                weatherData?.data.next_1_hours.summary
                                    .symbol_code
                            }
                        />
                    )}
                    {showTemperature && (
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
            {(showWind || showPrecipitation) && (
                <div className="weather-tile__weather-data-container">
                    {showWind && (
                        <Wind
                            windSpeed={
                                weatherData?.data.instant.details.wind_speed
                            }
                            unit={weather?.meta.units.wind_speed}
                        />
                    )}
                    {showPrecipitation && (
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
        </div>
    )
}

export { WeatherTile }
