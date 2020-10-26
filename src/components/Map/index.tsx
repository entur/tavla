import { BikeRentalStation, Scooter } from '@entur/sdk'
import React, { useState, memo } from 'react'

import ReactMapGL, { Marker } from 'react-map-gl'

import PositionPin from '../../assets/icons/positionPin'
import ScooterOperatorLogo from '../../assets/icons/scooterOperatorLogo'

import { StopPlaceWithDepartures } from '../../types'

import BikeRentalStationTag from './BikeRentalStationTag'
import StopPlaceTag from './StopPlaceTag'

const Map = ({
    stopPlaces,
    bikeRentalStations,
    scooters,
    walkTimes,
    interactive,
    mapStyle,
    latitude,
    longitude,
    zoom,
}: Props): JSX.Element => {
    const [viewport, setViewPort] = useState({
        latitude,
        longitude,
        width: 'auto',
        height: '100%',
        zoom,
        maxZoom: 18,
        minZoom: 13.5,
    })
    return (
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle={mapStyle || process.env.MAPBOX_STYLE_MAPVIEW}
            onViewportChange={
                interactive
                    ? (newViewPort): void => {
                          const {
                              zoom: newZoom,
                              maxZoom,
                              minZoom,
                          } = newViewPort
                          setViewPort({
                              latitude,
                              longitude,
                              width: 'auto',
                              height: '100%',
                              zoom: newZoom,
                              maxZoom,
                              minZoom,
                          })
                      }
                    : undefined
            }
        >
            {scooters?.map((scooter) => (
                <Marker
                    key={scooter.id}
                    latitude={scooter.lat}
                    longitude={scooter.lon}
                >
                    <ScooterOperatorLogo logo={scooter.operator} size={24} />
                </Marker>
            ))}
            {stopPlaces?.map((stopPlace) =>
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
                            walkTime={
                                walkTimes?.find(
                                    (walkTime) =>
                                        walkTime.stopId === stopPlace.id &&
                                        walkTime.walkTime !== undefined,
                                )?.walkTime ?? null
                            }
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
                    <BikeRentalStationTag
                        bikes={station.bikesAvailable ?? 0}
                        spaces={station.spacesAvailable ?? 0}
                    ></BikeRentalStationTag>
                </Marker>
            ))}
            <Marker
                latitude={viewport.latitude ?? 0}
                longitude={viewport.longitude ?? 0}
            >
                <PositionPin size={24} />
            </Marker>
        </ReactMapGL>
    )
}

interface Props {
    stopPlaces?: StopPlaceWithDepartures[] | null
    bikeRentalStations?: BikeRentalStation[] | null
    scooters?: Scooter[] | null
    walkTimes?: Array<{ stopId: string; walkTime: number }> | null
    interactive: boolean
    mapStyle?: string | undefined
    latitude: number
    longitude: number
    zoom: number
}

export default memo(Map)
