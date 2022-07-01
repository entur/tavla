import React, { useState, memo, useRef, useEffect, useMemo } from 'react'

import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl'

import type { MapRef, Point } from 'react-map-gl'

import { GeoJsonProperties } from 'geojson'

import type { ClusterProperties, PointFeature } from 'supercluster'
import useSupercluster from 'use-supercluster'
import polyline from 'google-polyline'

import { TransportMode } from '@entur/sdk'

import { Station, Vehicle } from '@entur/sdk/lib/mobility/types'

import { colors } from '@entur/tokens'
import { BicycleIcon, ParkIcon } from '@entur/icons'

import PositionPin from '../../assets/icons/positionPin'

import {
    DrawableRoute,
    IconColorType,
    Line,
    StopPlaceWithDepartures,
    Viewport,
} from '../../types'

import { Filter } from '../../services/realtimeVehicles/types/filter'

import { getIconColor, useDebounce } from '../../utils'
import { useSettingsContext } from '../../settings'

import useRealtimeVehicleData from '../../logic/useRealtimeVehicleData'
import { RealtimeVehicle } from '../../services/realtimeVehicles/types/realtimeVehicle'
import { useStopPlacesWithLines } from '../../logic/useStopPlacesWithLines'

import LineOverlay from './RealtimeVehicleTag/LineOverlay'
import BikeRentalStationTag from './BikeRentalStationTag'
import StopPlaceTag from './StopPlaceTag'
import ScooterMarkerTag from './ScooterMarkerTag'
import RealtimeVehicleTag from './RealtimeVehicleTag'

import './styles.scss'

const MapComponent = ({
    stopPlaces,
    bikeRentalStations,
    scooters,
    walkTimes,
    mapStyle,
    latitude,
    longitude,
    zoom,
}: Props): JSX.Element => {
    const [viewport] = useState<Viewport>({
        latitude,
        longitude,
        width: 'auto',
        height: '100%',
        zoom,
        maxZoom: 18,
        minZoom: 13.5,
    })

    const [scootersList, setScootersList] = useState<Vehicle[] | undefined>([])
    const [scooterPoints, setScooterPoints] = useState<any[] | undefined>([])

    const [bikeRentalStationsList, setBikeRentalStationsList] = useState<
        Station[] | undefined
    >([])
    const [bikeRentalStationsPoints, setBikeRentalStationsPoints] = useState<
        any[] | undefined
    >([])

    useEffect(() => {
        if (JSON.stringify(scooters) === JSON.stringify(scootersList)) return

        setScootersList(scooters)

        const mappedScooterPoints: GeoJSON.Feature[] | undefined =
            scooters?.map((scooter: Vehicle) => ({
                type: 'Feature' as const,
                properties: {
                    cluster: false,
                    scooterId: scooter.id,
                    scooterOperator: scooter.system.operator,
                },
                geometry: {
                    type: 'Point' as const,
                    coordinates: [scooter.lon, scooter.lat],
                },
            }))
        setScooterPoints(mappedScooterPoints)
    }, [scooters, scootersList])

    useEffect(() => {
        if (
            JSON.stringify(bikeRentalStations) ===
            JSON.stringify(bikeRentalStationsList)
        )
            return

        setBikeRentalStationsList(bikeRentalStations)

        const mappedBikeRentalStationsPoints: GeoJSON.Feature[] | undefined =
            bikeRentalStations?.map((bikeRentalStation: Station) => ({
                type: 'Feature' as const,
                properties: {
                    cluster: false,
                    stationId: bikeRentalStation.id,
                    bikesAvailable: bikeRentalStation.numBikesAvailable,
                    spacesAvailable: bikeRentalStation.numDocksAvailable,
                },
                geometry: {
                    type: 'Point' as const,
                    coordinates: [bikeRentalStation.lon, bikeRentalStation.lat],
                },
            }))

        setBikeRentalStationsPoints(mappedBikeRentalStationsPoints)
    }, [bikeRentalStations, bikeRentalStationsList])

    const scooterClusterMarkers =
        scooterPoints &&
        scooterPoints.map((scooter) => {
            const [slongitude, slatitude] = scooter.geometry.coordinates

            if (!slongitude || !slatitude) return null

            const { scooterId: id, cluster: isCluster } = scooter.properties

            return (
                <Source
                    key={id}
                    id={`${id}-source`}
                    type="geojson"
                    data={scooter}
                >
                    <Layer
                        id={`${id}-layer`}
                        type="circle"
                        paint={{
                            'circle-color': '#ffff00',
                            'circle-radius': 8,
                            'circle-stroke-color': '#333333',
                            'circle-stroke-width': 2,
                        }}
                    />
                </Source>
            )
            // return (
            //     <Marker
            //         key={
            //             pointCount
            //                 ? `cluster-${scooterCluster.id}`
            //                 : scooterCluster.properties.scooterId
            //         }
            //         latitude={slatitude}
            //         longitude={slongitude}
            //         style={{ zIndex: 4 }}
            //     >
            //         <ScooterMarkerTag
            //             pointCount={pointCount}
            //             operator={
            //                 pointCount
            //                     ? null
            //                     : scooterCluster.properties.scooterOperator
            //             }
            //         />
            //     </Marker>
            // )
        })

    const stopPlaceMarkers = stopPlaces?.map((stopPlace) => (
        <Marker
            key={stopPlace.id}
            latitude={stopPlace.latitude ?? 0}
            longitude={stopPlace.longitude ?? 0}
            style={{ zIndex: 6 }}
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
    ))

    const stationClusterMarkers =
        bikeRentalStationsPoints &&
        bikeRentalStationsPoints.map((bikeRentalStation) => {
            const [slongitude, slatitude] =
                bikeRentalStation.geometry.coordinates

            if (!slongitude || !slatitude) return null

            const {
                stationId: id,
                cluster: isCluster,
                bikesAvailable,
                spacesAvailable,
            } = bikeRentalStation.properties

            //console.log(bikeRentalStation)

            return (
                <Source
                    key={id}
                    id={`${id}-source`}
                    type="geojson"
                    data={bikeRentalStation}
                >
                    <Layer
                        id={`${id}-layer`}
                        type="circle"
                        paint={{
                            'circle-color': '#ffff00',
                            'circle-radius': 8,
                            'circle-stroke-color': '#333333',
                            'circle-stroke-width': 2,
                        }}
                    />
                    <Layer
                        id={`${id}-bikesAvailable`}
                        type="symbol"
                        layout={{
                            'text-field': ['get', 'bikesAvailable'],
                            'text-size': 14,
                            'text-offset': [0, -1.5],
                        }}
                        paint={{
                            'text-color': '#ffff00',
                            'text-halo-color': '#333333',
                            'text-halo-width': 1,
                        }}
                    />
                    <Layer
                        id={`${id}-spacesAvailable`}
                        type="symbol"
                        layout={{
                            'text-field': ['get', 'spacesAvailable'],
                            'text-size': 14,
                            'text-offset': [2, -1.5],
                        }}
                        paint={{
                            'text-color': '#ffff00',
                            'text-halo-color': '#333333',
                            'text-halo-width': 1,
                        }}
                    />

                    {/* <BikeRentalStationTag
                        bikes={bikeRentalStation.properties.bikesAvailable}
                        spaces={bikeRentalStation.properties.spacesAvailable}
                    /> */}
                    {/* <div className="bicycle-tag">
                        <div className="bicycle-tag__row">
                            <div className="bicycle-tag__row__icon">
                                <BicycleIcon
                                    key="bike-tile-icon"
                                    color={colors.brand.white}
                                />
                            </div>
                            <div className="bicycle-tag__row__amount">
                                {bikeRentalStation.properties.bikesAvailable}
                            </div>
                        </div>
                        <div className="bicycle-tag__row">
                            <div className="bicycle-tag__row__icon">
                                <ParkIcon
                                    key="space-tile-icon"
                                    color={colors.brand.white}
                                />
                            </div>
                            <div className="bicycle-tag__row__amount">
                                {bikeRentalStation.properties.spacesAvailable}
                            </div>
                        </div>
                    </div> */}
                </Source>
            )

            /*  return (
                <Marker
                    key={
                        isCluster
                            ? bikeRentalStation.id
                            : bikeRentalStation.properties.stationId
                    }
                    latitude={slatitude}
                    longitude={slongitude}
                    marker-size="large"
                    style={{ zIndex: 5 }}
                >
                    <BikeRentalStationTag
                        bikes={bikeRentalStation.properties.bikesAvailable}
                        spaces={bikeRentalStation.properties.spacesAvailable}
                    />
                </Marker>
            )*/
        })
    console.log('Logging map?')

    return (
        <ReactMapGL
            {...viewport}
            mapboxAccessToken="pk.eyJ1IjoiZW50dXIiLCJhIjoiY2o3dDF5ZWlrNGoyNjJxbWpscTlnMDJ2MiJ9.WLaC_f_uxaD1FLyZEjuchA"
            mapStyle="mapbox://styles/entur/ckfi7v87704jn19o71b6z02bp"
            reuseMaps
        >
            {scooterPoints && scooterClusterMarkers}
            {stopPlaces && stopPlaceMarkers}
            {bikeRentalStationsPoints && stationClusterMarkers}
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
    stopPlaces?: StopPlaceWithDepartures[]
    bikeRentalStations?: Station[]
    scooters?: Vehicle[]
    walkTimes?: Array<{ stopId: string; walkTime: number }>
    interactive: boolean
    mapStyle?: string | undefined
    latitude: number
    longitude: number
    zoom: number
}

export default memo(MapComponent)
