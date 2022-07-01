import React, { useState, memo, useEffect } from 'react'

import ReactMapGL, { Marker } from 'react-map-gl'

import splitbee from '@splitbee/web'

import { Station, Vehicle } from '@entur/sdk/lib/mobility/types'

import PositionPin from '../../assets/icons/positionPin'

import { StopPlaceWithDepartures, Viewport } from '../../types'

import BikeRentalStationTag from './BikeRentalStationTag'
import StopPlaceTag from './StopPlaceTag'
import ScooterMarkerTag from './ScooterMarkerTag'

import './styles.scss'

const MapComponent = ({
    stopPlaces,
    bikeRentalStations,
    scooters,
    walkTimes,
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
        scooterPoints.map((scooterCluster) => {
            const [slongitude, slatitude] = scooterCluster.geometry.coordinates

            if (!slongitude || !slatitude) return null

            const { cluster: isCluster } = scooterCluster.properties
            let pointCount = 0

            if (isCluster) {
                pointCount = (scooterCluster.properties as ClusterProperties)
                    .point_count
            }

            return (
                <Marker
                    key={
                        pointCount
                            ? `cluster-${scooterCluster.id}`
                            : scooterCluster.properties.scooterId
                    }
                    latitude={slatitude}
                    longitude={slongitude}
                    style={{ zIndex: 4 }}
                >
                    <ScooterMarkerTag
                        pointCount={pointCount}
                        operator={
                            pointCount
                                ? null
                                : scooterCluster.properties.scooterOperator
                        }
                    />
                </Marker>
            )
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

            const { cluster: isCluster } = bikeRentalStation.properties

            return (
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
            )
        })

    splitbee.track('MAP_RENDERED')

    return (
        <ReactMapGL
            {...viewport}
            mapboxAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle={process.env.MAPBOX_STYLE_MAPVIEW}
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
