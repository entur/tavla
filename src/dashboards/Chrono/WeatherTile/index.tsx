import React, { useEffect, useState } from 'react'

import { BikeRentalStation } from '@entur/sdk'

import { Vehicle } from '@entur/sdk/lib/mobility/types'

import './styles.scss'

import { StopPlaceWithDepartures } from '../../../types'
import { useWeather } from '../../../logic'
import { useContext } from 'react'
import { SettingsContext } from '../../../settings'
import { WeatherIconApi } from '../../../components/Weather'
import { ThermometerIcon, UmbrellaIcon, WindIcon } from '@entur/icons'

function WeatherTile(data: Props): JSX.Element {
    const [settings] = useContext(SettingsContext)
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

            <div className="weathertile__weatherData">
                <ThermometerIcon />
                <span className={temperatureClassName}>
                    {weather != null
                        ? weather[3].data.instant.details.air_temperature + '°'
                        : '?'}
                </span>
            </div>
            <div className="weathertile__weatherData">
                <UmbrellaIcon />
                <span className="weathertile__weatherData--color-blue">
                    {weather != null
                        ? weather[3].data.next_6_hours.details
                              .precipitation_amount
                        : '?'}
                    <span className="weathertile--subscript">mm</span>
                </span>
            </div>
            <div className="weathertile__weatherData">
                <WindIcon />
                {weather != null
                    ? weather[3].data.instant.details.wind_speed
                    : '?'}
                <span className="weathertile--subscript">m/s</span>
            </div>
        </div>
    )
}

interface Props {
    stopPlaces?: StopPlaceWithDepartures[] | null
    bikeRentalStations?: BikeRentalStation[] | null
    scooters?: Vehicle[] | null
    walkTimes?: Array<{ stopId: string; walkTime: number }> | null
    latitude?: number
    longitude?: number
    zoom?: number
}

export default WeatherTile
