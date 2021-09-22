import { BikeRentalStation, LegMode, TransportMode } from '@entur/sdk'
import React, { useState, memo, useRef, useEffect } from 'react'

import { InteractiveMap, Marker } from 'react-map-gl'
import type { MapRef } from 'react-map-gl'
import useSupercluster from 'use-supercluster'

import type { ClusterProperties } from 'supercluster'

import { Vehicle } from '@entur/sdk/lib/mobility/types'

import PositionPin from '../../assets/icons/positionPin'

import {
    IconColorType,
    StopPlaceWithDepartures,
    StopPlaceWithLines,
} from '../../types'

import { SubscriptionOptions } from '../../services/model/subscriptionOptions'
import { Filter } from '../../services/model/filter'
import { Options } from '../../services/model/options'

import useVehicleData from '../../logic/useVehicleData'

import { getStopPlacesWithLines } from '../../service'

import { getIconColor } from '../../utils'

import { IResponse, ITest, testClient, TEST_QUERY } from './test'

import BikeRentalStationTag from './BikeRentalStationTag'
import StopPlaceTag from './StopPlaceTag'
import ScooterMarkerTag from './ScooterMarkerTag'
import { LiveVehicleMarker } from './LiveVehicleMarker'

const defaultFilter: Filter = {
    monitored: true,
}

const defaultSubscriptionOptions: SubscriptionOptions = {
    enableLiveUpdates: true,
    bufferSize: 100,
    bufferTime: 1000,
}

const defaultOptions: Options = {
    sweepIntervalMs: 1000,
    removeExpired: true,
    removeExpiredAfterSeconds: 3600,
    markInactive: true,
    markInactiveAfterSeconds: 60,
}

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
    const [uniqueLineIds, setUniqueLineIds] = useState<string[] | undefined>(
        undefined,
    )

    const [lineNumberMapping, setLineNumberMapping] = useState<
        ITest[] | undefined
    >(undefined)

    const [viewport, setViewPort] = useState({
        latitude,
        longitude,
        width: 'auto',
        height: '100%',
        zoom,
        maxZoom: 18,
        minZoom: 13.5,
    })

    const vehicles = useVehicleData(
        defaultFilter,
        defaultSubscriptionOptions,
        defaultOptions,
        uniqueLineIds,
    )
    console.log('====================================')
    console.log('rendering')
    console.log('====================================')

    useEffect(() => {
        const gln = async () => {
            //get line number short hand
            const { data } = await testClient.query<IResponse>({
                query: TEST_QUERY,
                fetchPolicy: 'no-cache',
                variables: { ids: uniqueLineIds },
            })
            if (data.lines.length > 0) {
                console.log(data.lines)

                const mapping = data.lines
                setLineNumberMapping(mapping)
            }
        }
        if (uniqueLineIds) gln()
    }, [uniqueLineIds])

    const mapRef = useRef<MapRef>(null)
    const scooterpoints = scooters?.map((scooter: Vehicle) => ({
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
    const bikeRentalStationPoints = bikeRentalStations?.map(
        (bikeRentalStation: BikeRentalStation) => ({
            type: 'Feature' as const,
            properties: {
                cluster: false,
                stationId: bikeRentalStation.id,
                bikesAvailable: bikeRentalStation.bikesAvailable,
                spacesAvailable: bikeRentalStation.spacesAvailable,
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [
                    bikeRentalStation.longitude,
                    bikeRentalStation.latitude,
                ],
            },
        }),
    )

    const bounds = (mapRef.current
        ?.getMap()
        ?.getBounds()
        ?.toArray()
        ?.flat() || [0, 0, 0, 0]) as [number, number, number, number]

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

    useEffect(() => {
        const abortController = new AbortController()
        const test = async () => {
            if (stopPlaces) {
                const stopPlacesWithLines: StopPlaceWithLines[] =
                    await getStopPlacesWithLines(
                        stopPlaces.map((sPlace) => sPlace.id),
                        abortController.signal,
                    )

                const lineIds: string[] = stopPlacesWithLines.flatMap((el) =>
                    el.lines.map((line) => line.id),
                )
                setUniqueLineIds(new Array(...new Set(lineIds)))
            }
        }
        test()
        return () => {
            abortController.abort()
        }
    }, [stopPlaces])

    return (
        <InteractiveMap
            {...viewport}
            dragPan={{ inertia: 3 }}
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
            {vehicles.vehicles &&
                Object.values(vehicles.vehicles).map((vehicle, index) => (
                    <Marker
                        key={index}
                        latitude={vehicle.vehicle.location.latitude}
                        longitude={vehicle.vehicle.location.longitude}
                    >
                        <LiveVehicleMarker
                            liveVehicle={vehicle.vehicle}
                            lineData={lineNumberMapping?.find(
                                (line) =>
                                    line.id === vehicle.vehicle.line.lineRef,
                            )}
                        ></LiveVehicleMarker>
                    </Marker>
                ))}
            {scooterClusters.map((scooterCluster) => {
                const [slongitude, slatitude] =
                    scooterCluster.geometry.coordinates

                const { cluster: isCluster } = scooterCluster.properties
                let pointCount = 0

                if (isCluster) {
                    pointCount = (
                        scooterCluster.properties as ClusterProperties
                    ).point_count
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
            })}
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
            {stationClusters.map((stationCluster) => {
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
                    >
                        <BikeRentalStationTag
                            bikes={stationCluster.properties.bikesAvailable}
                            spaces={stationCluster.properties.spacesAvailable}
                        ></BikeRentalStationTag>
                    </Marker>
                )
            })}
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
    bikeRentalStations?: BikeRentalStation[] | null
    scooters?: Vehicle[] | null
    walkTimes?: Array<{ stopId: string; walkTime: number }> | null
    interactive: boolean
    mapStyle?: string | undefined
    latitude: number
    longitude: number
    zoom: number
}

export default memo(Map)
