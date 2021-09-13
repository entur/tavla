import React, { useEffect, useState } from 'react'
import './styles.scss'

import { ThermometerIcon, UmbrellaIcon, WindIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

import { useWeather } from '../../../logic'
import { WeatherIconApi } from '..'

const BREAKPOINTS = {
    fourItems: 570,
    threeItems: 380,
    twoItems: 290,
}

const BREAKPOINTS_COMPACT = {
    fourItemsDesktop: 1600,
    ThreeItemsDesktop: 1246,
}

interface Props {
    Compact?: boolean
    Map?: boolean
}

function WeatherTile(data: Props): JSX.Element {
    const weather = useWeather()

    const [temperatureClassName, setTemperatureClassName] = useState(
        'weather-tile__weatherData--color-red',
    )

    useEffect(() => {
        if (weather && weather[3].data.instant.details.air_temperature >= 0) {
            setTemperatureClassName('weather-tile__weatherData--color-red')
        } else {
            setTemperatureClassName('weather-tile__weatherData--color-blue')
        }
    }, [weather])

    const PercipitationAndWind = (): JSX.Element => {
        if (data?.Compact) {
            return (
                <>
                    {window.innerWidth > BREAKPOINTS.threeItems && (
                        <Tooltip content="De neste seks timene" placement="top">
                            <div className="weather-tile__weatherData">
                                <UmbrellaIcon size={20} />
                                <span className="weather-tile__weatherData--color-blue">
                                    {weather != null
                                        ? weather[3].data.next_6_hours.details
                                              .precipitation_amount
                                        : '?'}
                                    <span className="weather-tile--subscript">
                                        mm
                                    </span>
                                </span>
                            </div>
                        </Tooltip>
                    )}

                    {window.innerWidth > BREAKPOINTS.fourItems &&
                        !(
                            BREAKPOINTS_COMPACT.ThreeItemsDesktop <
                                window.innerWidth &&
                            window.innerWidth <
                                BREAKPOINTS_COMPACT.fourItemsDesktop
                        ) && (
                            <div className="weather-tile__weatherData">
                                <WindIcon size={20} />
                                {weather != null
                                    ? weather[3].data.instant.details.wind_speed
                                    : '?'}
                                <span className="weather-tile--subscript">
                                    m/s
                                </span>
                            </div>
                        )}
                </>
            )
        }

        return (
            <>
                {window.innerWidth > BREAKPOINTS.threeItems && (
                    <Tooltip content="De neste seks timene" placement="top">
                        <div className="weather-tile__weatherData">
                            <UmbrellaIcon size={20} />
                            <span className="weather-tile__weatherData--color-blue">
                                {weather != null
                                    ? weather[3].data.next_6_hours.details
                                          .precipitation_amount
                                    : '?'}
                                <span className="weather-tile--subscript">
                                    mm
                                </span>
                            </span>
                        </div>
                    </Tooltip>
                )}
                {window.innerWidth > BREAKPOINTS.fourItems && (
                    <div className="weather-tile__weatherData">
                        <WindIcon size={20} />
                        {weather != null
                            ? weather[3].data.instant.details.wind_speed
                            : '?'}
                        <span className="weather-tile--subscript">m/s</span>
                    </div>
                )}
            </>
        )
    }

    // TODO add asterix for weather symbol and percipitation stating it's for the next six hours
    return (
        <div
            className={
                'weather-tile ' + (data.Map ? 'weather-tile-map' : 'tile')
            }
        >
            <div>
                {weather && (
                    <WeatherIconApi
                        iconName={
                            weather[3].data.next_6_hours.summary.symbol_code
                        }
                    />
                )}
            </div>
            {window.innerWidth > BREAKPOINTS.twoItems && (
                <div className="weather-tile__weatherData">
                    <ThermometerIcon size={20} />
                    <span className={temperatureClassName}>
                        {weather != null
                            ? weather[3].data.instant.details.air_temperature +
                              '°'
                            : '?'}
                    </span>
                </div>
            )}
            <PercipitationAndWind />
        </div>
    )
}

export default WeatherTile
