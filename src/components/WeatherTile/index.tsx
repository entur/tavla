import React, { useEffect, useState } from 'react'

import { CloudRainIcon, UmbrellaIcon, WindIcon } from '@entur/icons'

import { useWeather } from '../../logic'
import {
    createAbortController,
    getWeatherDescriptionFromApi,
    getWeatherIconEntur,
} from '../../utils'
import { useSettingsContext } from '../../settings'

import './styles.scss'

interface Props {
    className?: string
}

interface weatherComponent {
    key: string
    display: boolean
    component: JSX.Element
}

function WeatherTile(props: Props): JSX.Element {
    const weather = useWeather()
    const [settings] = useSettingsContext()

    const {
        showIcon = true,
        showTemperature = true,
        showWind = true,
        showPrecipitation = true,
    } = settings || {}

    const [temperatureClassName, setTemperatureClassName] = useState(
        'weather-tile__weather-data-container__weather-data--color-red',
    )
    const [description, setDescription] = useState('')

    const weatherData = weather?.timeseries[3]

    useEffect(() => {
        const abortController = createAbortController()

        if (weatherData) {
            if (weatherData.data.instant.details.air_temperature >= 0) {
                setTemperatureClassName(
                    'weather-tile__weather-data-container__weather-data--color-red',
                )
            } else {
                setTemperatureClassName(
                    'weather-tile__weather-data-container__weather-data--color-blue',
                )
            }

            getWeatherDescriptionFromApi(
                weatherData.data.next_1_hours.summary.symbol_code,
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
        }
        return () => {
            abortController.abort()
        }
    }, [weatherData])

    const Icon = (): JSX.Element => (
        <div>
            {weatherData ? (
                <div className="icon-entur">
                    {getWeatherIconEntur(
                        weatherData.data.next_1_hours.summary.symbol_code,
                    )}
                </div>
            ) : (
                '…'
            )}
        </div>
    )

    const Temperature = (): JSX.Element => (
        <div className="weather-tile__icon-and-temperature__temperature-and-description">
            <div
                className={
                    'weather-tile__icon-and-temperature__temperature-and-description__temperature ' +
                    temperatureClassName
                }
            >
                {weatherData
                    ? parseInt(
                          weatherData.data.instant.details.air_temperature.toString(),
                      ) + '°'
                    : '…'}
            </div>
            <div className="weather-tile__icon-and-temperature__temperature-and-description__description">
                {description}
            </div>
        </div>
    )

    const Wind = (): JSX.Element => (
        <div className="weather-tile__weather-data-container__weather-data">
            <WindIcon size={20} />
            <div className="weather-tile__weather-data-container__weather-data__value">
                {weatherData
                    ? weatherData.data.instant.details.wind_speed +
                      ' ' +
                      weather.meta.units.wind_speed
                    : '…'}
            </div>
        </div>
    )

    const Precipitation = (): JSX.Element => (
        <div className="weather-tile__weather-data-container__weather-data">
            <CloudRainIcon size={20} />
            <div className="weather-tile__weather-data-container__weather-data__value">
                {weatherData
                    ? weatherData.data.next_1_hours.details
                          .precipitation_amount +
                      ' ' +
                      weather.meta.units.precipitation_amount
                    : '…'}
            </div>
        </div>
    )

    const ProbabilityOfrecipitation = (): JSX.Element => (
        <div className="weather-tile__weather-data-container__weather-data">
            <UmbrellaIcon size={20} />
            <div className="weather-tile__weather-data-container__weather-data__value">
                {weatherData
                    ? parseInt(
                          weatherData.data.next_1_hours.details.probability_of_precipitation.toString(),
                      ) +
                      ' ' +
                      weather.meta.units.probability_of_precipitation
                    : '…'}
            </div>
        </div>
    )

    const iconTempComponentArray: weatherComponent[] = [
        {
            key: 'Icon',
            display: showIcon,
            component: <Icon />,
        },
        {
            key: 'Temperature',
            display: showTemperature,
            component: <Temperature />,
        },
    ]

    const windPrecipitationComponentArray: weatherComponent[] = [
        {
            key: 'Wind',
            display: showWind,
            component: <Wind />,
        },
        {
            key: 'Precipitation',
            display: showPrecipitation,
            component: (
                <>
                    <Precipitation />
                    <ProbabilityOfrecipitation />
                </>
            ),
        },
    ]

    return (
        <div className={'weather-tile ' + props.className}>
            {(showIcon || showTemperature) && (
                <div className="weather-tile__icon-and-temperature">
                    {iconTempComponentArray
                        .filter((object) => object.display)
                        .map((object) =>
                            React.cloneElement(object.component, {
                                key: object.key,
                            }),
                        )}
                </div>
            )}
            {(showWind || showPrecipitation) && (
                <div className="weather-tile__weather-data-container">
                    {windPrecipitationComponentArray
                        .filter((object) => object.display)
                        .map((object) =>
                            React.cloneElement(object.component, {
                                key: object.key,
                            }),
                        )}
                </div>
            )}
        </div>
    )
}

export default WeatherTile
