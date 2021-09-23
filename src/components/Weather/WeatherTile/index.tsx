import React, { useEffect, useState } from 'react'
import './styles.scss'

import { CloudRainIcon, UmbrellaIcon, WindIcon } from '@entur/icons'

import { useWeather } from '../../../logic'
import { WeatherIcon } from '..'
import { getWeatherDescriptionFromApi } from '../../../utils'

interface Props {
    className?: string
    displayWeatherIcon?: boolean
    displayTemperature?: boolean
    displayPrecipitation?: boolean
    displayWind?: boolean
}

function WeatherTile({
    displayWeatherIcon = true,
    displayTemperature = true,
    displayPrecipitation = true,
    displayWind = true,
    ...props
}: Props): JSX.Element {
    const weather = useWeather()

    const [temperatureClassName, setTemperatureClassName] = useState(
        'weather-tile__weather-data--color-red',
    )
    const [description, setDescription] = useState('')

    useEffect(() => {
        const abortController = new AbortController()

        if (
            weather &&
            weather.timeseries[3].data.instant.details.air_temperature >= 0
        ) {
            setTemperatureClassName('weather-tile__weather-data--color-red')
        } else {
            setTemperatureClassName('weather-tile__weather-data--color-blue')
        }

        if (weather)
            getWeatherDescriptionFromApi(
                weather.timeseries[3].data.next_1_hours.summary.symbol_code,
                abortController.signal,
            )
                .then((fetchedDescription) =>
                    setDescription(fetchedDescription),
                )
                .catch((error) => {
                    if (error.name === 'AbortError') return
                    setDescription('')
                    throw error
                })

        return () => {
            abortController.abort()
        }
    }, [weather, window.innerWidth])

    const Icon = (): JSX.Element => (
        <div className="weather-tile__icon-and-temperature__weather-icon">
            {weather ? (
                <WeatherIcon
                    iconName={
                        weather.timeseries[3].data.next_1_hours.summary
                            .symbol_code
                    }
                />
            ) : (
                '?'
            )}
        </div>
    )

    const Temperature = (): JSX.Element => (
        <div className="weather-tile__weather-data__temperature-and-description">
            <span
                className={
                    'weather-tile__weather-data__temperature-and-description__temperature ' +
                    temperatureClassName
                }
            >
                {weather
                    ? parseInt(
                          weather.timeseries[3].data.instant.details.air_temperature.toString(),
                      ) + '°'
                    : '?'}
            </span>
            <span className="weather-tile__weather-data__temperature-and-description__description">
                {description}
            </span>
        </div>
    )

    const Wind = (): JSX.Element => (
        <div className="weather-tile__weather-data">
            <WindIcon size={20} />
            <span className="weather-tile__weather-data__value">
                {weather
                    ? weather.timeseries[3].data.instant.details.wind_speed +
                      ' ' +
                      weather.meta.units.wind_speed
                    : '?'}
            </span>
        </div>
    )

    const Precipitation = (): JSX.Element => (
        <div className="weather-tile__weather-data">
            <CloudRainIcon size={20} />
            <span className="weather-tile__weather-data__value">
                {weather
                    ? weather.timeseries[3].data.next_1_hours.details
                          .precipitation_amount +
                      ' ' +
                      weather.meta.units.precipitation_amount
                    : '?'}
            </span>
        </div>
    )

    const ProbabilityOfrecipitation = (): JSX.Element => (
        <div className="weather-tile__weather-data">
            <UmbrellaIcon size={20} />
            <span className="weather-tile__weather-data__value">
                {weather
                    ? parseInt(
                          weather.timeseries[3].data.next_1_hours.details.probability_of_precipitation.toString(),
                      ) +
                      ' ' +
                      weather.meta.units.probability_of_precipitation
                    : '?'}
            </span>
        </div>
    )

    return (
        <div className={'weather-tile ' + props.className}>
            <div className="weather-tile__icon-and-temperature">
                {displayWeatherIcon && <Icon />}
                {displayTemperature && <Temperature />}
            </div>
            {displayWind && <Wind />}
            {displayPrecipitation && <Precipitation />}
            {displayPrecipitation && <ProbabilityOfrecipitation />}
        </div>
    )
}

export default WeatherTile
