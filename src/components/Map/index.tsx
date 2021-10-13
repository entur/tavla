import React, { useState, memo, useRef, useEffect, useMemo } from 'react'

import { InteractiveMap, Marker } from 'react-map-gl'
import type { MapRef } from 'react-map-gl'

import type { ClusterProperties } from 'supercluster'
import useSupercluster from 'use-supercluster'
import polyline from 'google-polyline'

import { TransportMode } from '@entur/sdk'

import { Station, Vehicle } from '@entur/sdk/lib/mobility/types'

import PositionPin from '../../assets/icons/positionPin'

import { IconColorType, StopPlaceWithDepartures } from '../../types'

import { Filter } from '../../services/realtimeVehicles/types/filter'

import { getIconColor, useDebounce } from '../../utils'

import useRealtimeVehicleData from '../../logic/useRealtimeVehicleData'
import { RealtimeVehicle } from '../../services/realtimeVehicles/types/realtimeVehicle'

import LineOverlay from './RealtimeVehicleTag/LineOverlay'
import BikeRentalStationTag from './BikeRentalStationTag'
import StopPlaceTag from './StopPlaceTag'
import ScooterMarkerTag from './ScooterMarkerTag'
import RealtimeVehicleTag from './RealtimeVehicleTag'

import './styles.scss'

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

    const debouncedViewport = useDebounce(viewport, 200)
    const mapRef = useRef<MapRef>(null)
    const [filter, setFilter] = useState<Filter>({})
    const { realtimeVehicles } = useRealtimeVehicleData(filter)
    const [bounds, setBounds] = useState<[number, number, number, number]>(
        mapRef.current?.getMap()?.getBounds()?.toArray()?.flat() ||
            ([0, 0, 0, 0] as [number, number, number, number]),
    )

    const [hoveredVehicle, setHoveredVehicle] =
        useState<RealtimeVehicle | null>(null)

    const displayedLine = useMemo(() => {
        if (!hoveredVehicle || !hoveredVehicle.line.pointsOnLink) return null

        const cords = polyline.decode(hoveredVehicle.line.pointsOnLink)

        return (
            <LineOverlay
                points={cords}
                color={getIconColor(
                    hoveredVehicle.mode.toLowerCase() as TransportMode,
                    IconColorType.DEFAULT,
                )}
            ></LineOverlay>
        )
    }, [hoveredVehicle])

    useEffect(() => {
        const newBounds = (mapRef.current
            ?.getMap()
            ?.getBounds()
            ?.toArray()
            ?.flat() || [0, 0, 0, 0]) as [number, number, number, number]

        setBounds(newBounds)
        setFilter((prevFilter: Filter) => ({
            ...prevFilter,
            boundingBox: {
                minLat: newBounds[1],
                minLon: newBounds[0],
                maxLat: newBounds[3],
                maxLon: newBounds[2],
            },
        }))
    }, [mapRef, debouncedViewport])

    const scooterpoints = useMemo(
        () =>
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
            })),
        [scooters],
    )

    const bikeRentalStationPoints = useMemo(
        () =>
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
            })),
        [bikeRentalStations],
    )

    const { clusters: scooterClusters } = useSupercluster({
        points: scooterpoints || [],
        bounds,
        zoom: viewport.zoom,
        options: { radius: 38, maxZoom: 18 },
    })

    const { clusters: stationClusters } = useSupercluster({
        points: bikeRentalStationPoints || [],
        bounds,
        zoom: viewport.zoom,
        options: {
            radius: 45,
            maxZoom: 18,
            map: (props): Record<string, unknown> => ({
                bikesAvailable: props.bikesAvailable,
                spacesAvailable: props.spacesAvailable,
            }),
            reduce: (acc, props): Record<string, unknown> => {
                acc.bikesAvailable += props.bikesAvailable
                acc.spacesAvailable += props.spacesAvailable
                return acc
            },
        },
    })
    const realtimeVehicleMarkers = useMemo(
        () =>
            realtimeVehicles
                ? realtimeVehicles.map((vehicle) => (
                      <Marker
                          key={vehicle.vehicleRef}
                          latitude={vehicle.location.latitude}
                          longitude={vehicle.location.longitude}
                          className="map__realtime-vehicle-marker"
                          offsetTop={-25}
                          offsetLeft={-10}
                      >
                          <RealtimeVehicleTag
                              realtimeVehicle={vehicle}
                              setHoveredVehicle={setHoveredVehicle}
                              isHovered={
                                  hoveredVehicle
                                      ? hoveredVehicle.vehicleRef ===
                                        vehicle.vehicleRef
                                      : false
                              }
                          ></RealtimeVehicleTag>
                      </Marker>
                  ))
                : [],
        [realtimeVehicles, hoveredVehicle],
    )

    const scooterClusterMarkers = useMemo(() => {
        scooterClusters.map((scooterCluster) => {
            const [slongitude, slatitude] = scooterCluster.geometry.coordinates

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
                    className="map__scooter-marker"
                >
                    <ScooterMarkerTag
                        pointCount={pointCount}
                        operator={
                            pointCount
                                ? null
                                : scooterCluster.properties.scooterOperator
                        }
                    ></ScooterMarkerTag>
                </Marker>
            )
        })
    }, [scooterClusters])

    const stopPlaceMarkers = useMemo(
        () =>
            stopPlaces?.map((stopPlace) =>
                stopPlace.departures.length > 0 ? (
                    <Marker
                        key={stopPlace.id}
                        latitude={stopPlace.latitude ?? 0}
                        longitude={stopPlace.longitude ?? 0}
                        offsetLeft={-50}
                        offsetTop={-10}
                        className="map__stop-place-marker"
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
            ),
        [stopPlaces, walkTimes],
    )

    const stationClusterMarkers = useMemo(
        () =>
            stationClusters.map((stationCluster) => {
                const [slongitude, slatitude] =
                    stationCluster.geometry.coordinates

                const { cluster: isCluster } = stationCluster.properties

                return (
                    <Marker
                        key={
                            isCluster
                                ? stationCluster.id
                                : stationCluster.properties.stationId
                        }
                        latitude={slatitude}
                        longitude={slongitude}
                        marker-size="large"
                        className="map__bike-rental-station-marker"
                    >
                        <BikeRentalStationTag
                            bikes={stationCluster.properties.bikesAvailable}
                            spaces={stationCluster.properties.spacesAvailable}
                        ></BikeRentalStationTag>
                    </Marker>
                )
            }),
        [stationClusters],
    )

    return (
        <InteractiveMap
            {...viewport}
            dragPan={false}
            touchAction="pan-y"
            mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle={mapStyle || process.env.MAPBOX_STYLE_MAPVIEW}
            onViewportChange={
                interactive
                    ? (newViewPort: any): void => {
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
            ref={mapRef}
        >
            {realtimeVehicles && realtimeVehicleMarkers}
            {displayedLine}
            {scooterClusters && scooterClusterMarkers}
            {stopPlaces && stopPlaceMarkers}
            {stationClusters && stationClusterMarkers}
            <Marker
                latitude={viewport.latitude ?? 0}
                longitude={viewport.longitude ?? 0}
            >
                <PositionPin size={24} />
            </Marker>
        </InteractiveMap>
    )
}

interface Props {
    stopPlaces?: StopPlaceWithDepartures[] | null
    bikeRentalStations?: Station[] | null
    scooters?: Vehicle[] | null
    walkTimes?: Array<{ stopId: string; walkTime: number }> | null
    interactive: boolean
    mapStyle?: string | undefined
    latitude: number
    longitude: number
    zoom: number
}

export default memo(Map)
