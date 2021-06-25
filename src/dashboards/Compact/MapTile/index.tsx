import React from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

import { BikeRentalStation, Scooter } from '@entur/sdk'

import MapView from '../../../components/Map'

import './styles.scss'

import { StopPlaceWithDepartures } from '../../../types'

function MapTile(data: Props): JSX.Element {
    return (
        <div className="maptile">
            <MapView {...data} interactive={false}></MapView>
        </div>
    )
}

interface Props {
    stopPlaces: StopPlaceWithDepartures[] | null
    bikeRentalStations: BikeRentalStation[] | null
    scooters: Scooter[] | null
    walkTimes: Array<{ stopId: string; walkTime: number }> | null
    latitude: number
    longitude: number
    zoom: number
}

export default MapTile
