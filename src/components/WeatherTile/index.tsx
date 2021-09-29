import React, { useEffect, useState } from 'react'
import './styles.scss'

import { CloudRainIcon, UmbrellaIcon, WindIcon } from '@entur/icons'

import { useWeather } from '../../logic'
import { getWeatherDescriptionFromApi, getWeatherIconEntur } from '../../utils'
import { useSettingsContext } from '../../settings'

interface Props {
    className?: string
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

    useEffect(() => {
        const abortController = new AbortController()

        if (weather) {
            if (
                weather.timeseries[3].data.instant.details.air_temperature >= 0
            ) {
                setTemperatureClassName(
                    'weather-tile__weather-data-container__weather-data--color-red',
                )
            } else {
                setTemperatureClassName(
                    'weather-tile__weather-data-container__weather-data--color-blue',
                )
            }

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
        }
        return () => {
            abortController.abort()
        }
    }, [weather])

    const Icon = (): JSX.Element => (
        <div className="weather-tile__icon-and-temperature__weather-icon">
            {weather ? (
                <div className="icon-entur">
                    {getWeatherIconEntur(
                        weather.timeseries[3].data.next_1_hours.summary
                            .symbol_code,
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
                {weather
                    ? parseInt(
                          weather.timeseries[3].data.instant.details.air_temperature.toString(),
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
                {weather
                    ? weather.timeseries[3].data.instant.details.wind_speed +
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
                {weather
                    ? weather.timeseries[3].data.next_1_hours.details
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
                {weather
                    ? parseInt(
                          weather.timeseries[3].data.next_1_hours.details.probability_of_precipitation.toString(),
                      ) +
                      ' ' +
                      weather.meta.units.probability_of_precipitation
                    : '…'}
            </div>
        </div>
    )

    interface weatherComponent {
        key: string
        display: boolean
        component: JSX.Element
    }

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
