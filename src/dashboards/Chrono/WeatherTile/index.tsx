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
                <svg
                    width="34"
                    height="28"
                    viewBox="0 0 34 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="5"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M12 1V3"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M12 21V23"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M4.21997 4.21997L5.63997 5.63997"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M18.36 18.36L19.78 19.78"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M1 12H3"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M21 12H23"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M4.21997 19.78L5.63997 18.36"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M18.36 5.63997L19.78 4.21997"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M28 17H26.74C25.7004 12.9739 21.7499 10.4154 17.6508 11.1136C13.5517 11.8117 10.6708 15.5338 11.0227 19.677C11.3746 23.8202 14.8418 27.0031 19 27H28C30.7614 27 33 24.7614 33 22C33 19.2386 30.7614 17 28 17Z"
                        fill="white"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
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
