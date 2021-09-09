import React, { useCallback, useEffect, useRef, useState } from 'react'
import './styles.scss'

import { useWeather } from '../../../logic'
import { WeatherIconApi } from '../../../components/Weather'
import { ThermometerIcon, UmbrellaIcon, WindIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

const BREAKPOINTS = {
    fourItems: 570,
    threeItems: 380,
    twoItems: 290,
}

function WeatherTile(data: Props): JSX.Element {
    const weather = useWeather()

    const [temperatureClassName, setTemperatureClassName] = useState(
        'weathertile__weatherData--color-red',
    )

    useEffect(() => {
        if (weather && weather[3].data.instant.details.air_temperature >= 0) {
            setTemperatureClassName('weathertile__weatherData--color-red')
        } else {
            setTemperatureClassName('weathertile__weatherData--color-blue')
        }
    }, [weather])

    return (
        <div className="weathertile tile">
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
                <div className="weathertile__weatherData">
                    <ThermometerIcon size={20} />
                    <span className={temperatureClassName}>
                        {weather != null
                            ? weather[3].data.instant.details.air_temperature +
                              '°'
                            : '?'}
                    </span>
                </div>
            )}
            {window.innerWidth > BREAKPOINTS.threeItems && (
                <Tooltip content="De neste seks timene" placement="top">
                    <div className="weathertile__weatherData">
                        <UmbrellaIcon size={20} />
                        <span className="weathertile__weatherData--color-blue">
                            {weather != null
                                ? weather[3].data.next_6_hours.details
                                      .precipitation_amount
                                : '?'}
                            <span className="weathertile--subscript">mm</span>
                        </span>
                    </div>
                </Tooltip>
            )}

            {window.innerWidth > BREAKPOINTS.fourItems && (
                <div className="weathertile__weatherData">
                    <WindIcon size={20} />
                    {weather != null
                        ? weather[3].data.instant.details.wind_speed
                        : '?'}
                    <span className="weathertile--subscript">m/s</span>
                </div>
            )}
        </div>
    )
}

interface Props {
    iconSet?: string
}

export default WeatherTile
