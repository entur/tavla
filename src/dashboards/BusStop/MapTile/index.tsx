import React from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'

import { Station, Vehicle } from '@entur/sdk/lib/mobility/types'

import MapView from '../../../components/Map'

import { StopPlaceWithDepartures } from '../../../types'
import { isMobileWeb } from '../../../utils'

import './styles.scss'

function MapTile(data: Props): JSX.Element {
    return (
        <div className="maptile">
            <MapView {...data} interactive={isMobileWeb()} />
        </div>
    )
}

interface Props {
    stopPlaces: StopPlaceWithDepartures[]
    bikeRentalStations: Station[]
    scooters: Vehicle[]
    walkTimes?: Array<{ stopId: string; walkTime: number }>
    latitude: number
    longitude: number
    zoom: number
}

export default MapTile
