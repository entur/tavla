import React from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

import { BikeRentalStation } from '@entur/sdk'

import { Vehicle } from '@entur/sdk/lib/mobility/types'

import MapView from '../../../components/Map'

import './styles.scss'

import { StopPlaceWithDepartures } from '../../../types'

function MapTile(data: Props): JSX.Element {
    return (
        <div className="maptile">
            <MapView {...data} interactive />
        </div>
    )
}

interface Props {
    stopPlaces: StopPlaceWithDepartures[] | null
    bikeRentalStations: BikeRentalStation[] | null
    scooters: Vehicle[] | null
    walkTimes: Array<{ stopId: string; walkTime: number }> | null
    latitude: number
    longitude: number
    zoom: number
}

export default MapTile
