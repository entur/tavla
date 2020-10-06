import React, { useState } from 'react'

import ReactMapGL, { Marker } from 'react-map-gl'
import { StopPlaceWithDepartures } from '../../../types'
import { BikeRentalStation } from '@entur/sdk'
import PositionPin from '../../../assets/icons/positionPin'

import { DEFAULT_ZOOM } from '../../../constants'
import { useSettingsContext } from '../../../settings'

import './styles.scss'
import BicycleTag from '../BicycleTag'
import DepartureTag from '../DepartureTag'
import StopPlaceTag from '../StopPlaceTag'
import { useWalkTime } from '../../../logic'

const MapView = ({
    bikeRentalStations,
    stopPlacesWithDepartures,
}: Props): JSX.Element => {
    const [settings, { setZoom }] = useSettingsContext()
    const [viewport, setViewPort] = useState({
        latitude: settings?.coordinates?.latitude,
        longitude: settings?.coordinates?.longitude,
        width: 'auto',
        height: window.innerHeight - 124,
        zoom: settings?.zoom ?? DEFAULT_ZOOM,
        maxZoom: 16,
        minZoom: 13.5,
    })
    const walkTimes = useWalkTime(stopPlacesWithDepartures)
    return (
        <div>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                mapStyle={process.env.MAPBOX_STYLE}
                onViewportChange={(vp): void => {
                    const { zoom, maxZoom, minZoom } = vp
                    setZoom(zoom)
                    setViewPort({
                        latitude: settings?.coordinates?.latitude,
                        longitude: settings?.coordinates?.longitude,
                        width: 'auto',
                        height: window.innerHeight - 124,
                        zoom,
                        maxZoom,
                        minZoom,
                    })
                }}
            >
                {stopPlacesWithDepartures?.map((stopPlace) =>
                    stopPlace.departures.length > 0 ? (
                        <Marker
                            key={stopPlace.id}
                            latitude={stopPlace.latitude ?? 0}
                            longitude={stopPlace.longitude ?? 0}
                            offsetLeft={-50}
                            offsetTop={-10}
                        >
                            <StopPlaceTag
                                stopPlace={stopPlace}
                                walkTimes={walkTimes}
                            />
                        </Marker>
                    ) : (
                        []
                    ),
                )}
                {bikeRentalStations?.map((station) => (
                    <Marker
                        key={station.id}
                        latitude={station.latitude}
                        longitude={station.longitude}
                        marker-size="large"
                    >
                        <BicycleTag
                            bikes={station.bikesAvailable ?? 0}
                            spaces={station.spacesAvailable ?? 0}
                        ></BicycleTag>
                    </Marker>
                ))}
                <Marker
                    latitude={viewport.latitude ?? 0}
                    longitude={viewport.longitude ?? 0}
                >
                    <PositionPin size={24} />
                </Marker>
            </ReactMapGL>
            <div className="departure-display">
                {stopPlacesWithDepartures?.map((sp) =>
                    sp.departures.length ? (
                        <DepartureTag key={sp.id} stopPlace={sp}></DepartureTag>
                    ) : (
                        []
                    ),
                )}
            </div>
        </div>
    )
}

interface Props {
    stopPlacesWithDepartures: StopPlaceWithDepartures[] | null
    bikeRentalStations: BikeRentalStation[] | null
}

export default MapView
