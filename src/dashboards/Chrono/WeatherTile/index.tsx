import React from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

import { BikeRentalStation } from '@entur/sdk'

import { Vehicle } from '@entur/sdk/lib/mobility/types'

import './styles.scss'

import { StopPlaceWithDepartures } from '../../../types'
import Tile from '../components/Tile'
import { CloudDownloadIcon, ValidationCheckIcon } from '@entur/icons'
import { useWeather } from '../../../logic'
import { DataCell, TableBody, TableRow } from '@entur/table'
import { settings } from 'cluster'
import { useContext } from 'react'
import { SettingsContext } from '../../../settings'

function WeatherTile(data: Props): JSX.Element {
    const [settings] = useContext(SettingsContext)
    const weather = useWeather()
    weather !== null ? console.log(weather[3].data) : null

    return (
        <div className="weathertile tile">
            <div className="tilerows__icon">
                <ValidationCheckIcon />
            </div>

            <div className="tilerows__icon">
                {/* <ValidationCheckIcon inline /> */}
                {weather != null
                    ? weather[3].data.instant.details.air_temperature + '°'
                    : '?'}
            </div>

            <div className="tilerows__icon">
                {weather != null
                    ? weather[3].data.instant.details.wind_speed +
                      String.fromCharCode(160) +
                      'm/s'
                    : '?'}
            </div>

            <div className="tilerows__icon">
                {weather != null
                    ? weather[3].data.next_6_hours.details
                          .precipitation_amount +
                      String.fromCharCode(160) +
                      'mm'
                    : '?'}
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
