import React, { useEffect, useState } from 'react'
import './styles.scss'

import { ThermometerIcon, UmbrellaIcon, WindIcon } from '@entur/icons'

import { useWeather } from '../../../logic'
import { WeatherIconApi } from '..'
interface Props {
    className?: string
    displayTemperature?: boolean
    displayPrecipitation?: boolean
    displayWind?: boolean
}

function WeatherTile({
    displayTemperature: displayTwoItems = true,
    displayPrecipitation: displayThreeItems = true,
    displayWind: displayFourItems = true,
    ...props
}: Props): JSX.Element {
    const weather = useWeather()

    const [temperatureClassName, setTemperatureClassName] = useState(
        'weather-tile__weather-data--color-red',
    )

    useEffect(() => {
        if (weather && weather[3].data.instant.details.air_temperature >= 0) {
            setTemperatureClassName('weather-tile__weather-data--color-red')
        } else {
            setTemperatureClassName('weather-tile__weather-data--color-blue')
        }
    }, [weather])

    const Icon = (): JSX.Element => (
        <div className="weather-tile__weather-icon">
            {weather && (
                <WeatherIconApi
                    iconName={weather[3].data.next_1_hours.summary.symbol_code}
                />
            )}
        </div>
    )

    const Temperature = (): JSX.Element => (
        <div className="weather-tile__weather-data">
            <ThermometerIcon size={20} />
            <span className={temperatureClassName}>
                {weather
                    ? weather[3].data.instant.details.air_temperature + '°'
                    : '?'}
            </span>
        </div>
    )

    const Precipitation = (): JSX.Element => (
        <div className="weather-tile__weather-data">
            <UmbrellaIcon size={20} />
            <span className="weather-tile__weather-data--color-blue">
                {weather
                    ? weather[3].data.next_1_hours.details.precipitation_amount
                    : '?'}
                <span className="weather-tile--subscript">mm</span>
            </span>
        </div>
    )

    const Wind = (): JSX.Element => (
        <div className="weather-tile__weather-data">
            <WindIcon size={20} />
            {weather ? weather[3].data.instant.details.wind_speed : '?'}
            <span className="weather-tile--subscript">m/s</span>
        </div>
    )

    return (
        <div className={'weather-tile ' + props.className}>
            <Icon />
            {displayTwoItems && <Temperature />}
            {displayThreeItems && <Precipitation />}
            {displayFourItems && <Wind />}
        </div>
    )
}

export default WeatherTile
