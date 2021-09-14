import React, { useEffect, useState } from 'react'
import './styles.scss'

import { ThermometerIcon, UmbrellaIcon, WindIcon } from '@entur/icons'

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
    compact?: boolean
    className?: string
}

function WeatherTile(props: Props): JSX.Element {
    const weather = useWeather()

    const DISPLAY_FOUR_ITEMS_CHRONO = window.innerWidth > BREAKPOINTS.fourItems
    const DISPLAY_FOUR_ITEMS_COMPACT =
        window.innerWidth > BREAKPOINTS.fourItems &&
        !(
            BREAKPOINTS_COMPACT.ThreeItemsDesktop < window.innerWidth &&
            window.innerWidth < BREAKPOINTS_COMPACT.fourItemsDesktop
        )
    const DISPLAY_THREE_ITEMS = window.innerWidth > BREAKPOINTS.threeItems
    const DISPLAY_TWO_ITEMS = window.innerWidth > BREAKPOINTS.threeItems
    const DISPLAY_FOUR_ITEMS = props.compact
        ? DISPLAY_FOUR_ITEMS_COMPACT
        : DISPLAY_FOUR_ITEMS_CHRONO

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
            {DISPLAY_TWO_ITEMS && <Temperature />}
            {DISPLAY_THREE_ITEMS && <Precipitation />}
            {DISPLAY_FOUR_ITEMS && <Wind />}
        </div>
    )
}

export default WeatherTile
