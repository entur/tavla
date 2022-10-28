import React from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Station, Vehicle } from '@entur/sdk/lib/mobility/types'
import { Map } from '../../../components/Map/Map'
import { StopPlaceWithDepartures } from '../../../types'
import { isMobileWeb } from '../../../utils/utils'
import './MapTile.scss'

function MapTile(data: Props): JSX.Element {
    return (
        <div className="maptile">
            <Map {...data} interactive={isMobileWeb()} />
        </div>
    )
}

interface Props {
    stopPlaces?: StopPlaceWithDepartures[]
    bikeRentalStations?: Station[]
    scooters?: Vehicle[]
    walkTimes?: Array<{ stopId: string; walkTime: number }>
    latitude: number
    longitude: number
    zoom: number
}

export { MapTile }
