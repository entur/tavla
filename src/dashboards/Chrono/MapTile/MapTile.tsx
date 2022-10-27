import React from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Map } from '../../../components/Map/Map'
import { StopPlaceWithDepartures } from '../../../types'
import {
    UseMobility_VehicleFragment,
    UseRentalStations_StationFragment,
} from '../../../../graphql-generated/mobility-v2'
import './MapTile.scss'

function MapTile(data: Props): JSX.Element {
    return (
        <div className="maptile">
            <Map {...data} interactive />
        </div>
    )
}

interface Props {
    stopPlaces?: StopPlaceWithDepartures[]
    bikeRentalStations?: UseRentalStations_StationFragment[]
    scooters?: UseMobility_VehicleFragment[]
    walkTimes?: Array<{ stopId: string; walkTime: number }>
    latitude: number
    longitude: number
    zoom: number
}

export { MapTile }
