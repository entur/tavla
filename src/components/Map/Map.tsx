import React, { useState, memo, useRef, useEffect, useMemo } from 'react'
import { InteractiveMap, Marker } from 'react-map-gl'
import type { MapRef } from 'react-map-gl'
import type { ClusterProperties } from 'supercluster'
import useSupercluster from 'use-supercluster'
import polyline from 'google-polyline'
import { TransportMode } from '@entur/sdk'
import { PositionPin } from '../../assets/icons/PositionPin'
import {
    DrawableRoute,
    IconColorType,
    Line,
    StopPlaceWithDepartures,
    Viewport,
} from '../../types'
import { useSettings } from '../../settings/SettingsProvider'
import { useRealtimeVehicleData } from '../../logic/use-realtime-vehicle-data/useRealtimeVehicleData'
import { RealtimeVehicle } from '../../logic/use-realtime-vehicle-data/types'
import {
    UseMobility_VehicleFragment,
    UseRentalStations_StationFragment,
} from '../../../graphql-generated/mobility-v2'
import { useStopPlacesWithLines } from '../../logic/useStopPlacesWithLines'
import { useDebounce } from '../../hooks/useDebounce'
import { getIconColor } from '../../utils/icon'
import { BoundingBox } from '../../../graphql-generated/vehicles-v1'
import { LineOverlay } from './RealtimeVehicleTag/LineOverlay/LineOverlay'
import { BikeRentalStationTag } from './BikeRentalStationTag/BikeRentalStationTag'
import { StopPlaceTag } from './StopPlaceTag/StopPlaceTag'
import { ScooterMarkerTag } from './ScooterMarkerTag/ScooterMarkerTag'
import { RealtimeVehicleTag } from './RealtimeVehicleTag/RealtimeVehicleTag'
import './Map.scss'

const Map = memo(function Map({
    stopPlaces,
    bikeRentalStations,
    scooters,
    walkTimes,
    interactive,
    mapStyle,
    latitude,
    longitude,
    zoom,
}: Props) {
    const [viewport, setViewPort] = useState<Viewport>({
        latitude,
        longitude,
        width: 'auto',
        height: '100%',
        zoom,
        maxZoom: 18,
        minZoom: 13.5,
    })

    const [settings] = useSettings()
    const {
        permanentlyVisibleRoutesInMap,
        hiddenRealtimeDataLineRefs,
        showRoutesInMap,
        hideRealtimeData,
    } = settings || {}
    const uniqueLines = useStopPlacesWithLines()

    const debouncedViewport = useDebounce(viewport, 200)
    const mapRef = useRef<MapRef>(null)
    const [boundingBox, setBoundingBox] = useState<BoundingBox>({
        minLat: 0,
        minLon: 0,
        maxLat: 0,
        maxLon: 0,
    })
    const realtimeVehicles = useRealtimeVehicleData(boundingBox)
    const [bounds, setBounds] = useState<[number, number, number, number]>(
        mapRef.current?.getMap()?.getBounds()?.toArray()?.flat() ||
            ([0, 0, 0, 0] as [number, number, number, number]),
    )

    const [hoveredVehicle, setHoveredVehicle] = useState<
        RealtimeVehicle | undefined
    >(undefined)

    const hoveredRoute = useMemo(() => {
        if (
            !hoveredVehicle ||
            !hoveredVehicle.line.pointsOnLink ||
            !showRoutesInMap
        )
            return null

        const coords = polyline.decode(hoveredVehicle.line.pointsOnLink)

        return (
            <LineOverlay
                routes={[
                    {
                        points: coords,
                        color: getIconColor(
                            hoveredVehicle.mode?.toLowerCase() as TransportMode,
                            IconColorType.DEFAULT,
                        ),
                    },
                ]}
            />
        )
    }, [hoveredVehicle, showRoutesInMap])

    const permanentlyDrawnRoutes = useMemo(() => {
        if (
            !permanentlyVisibleRoutesInMap ||
            !showRoutesInMap ||
            hideRealtimeData
        )
            return null

        const routesToDraw = permanentlyVisibleRoutesInMap
            .filter(
                ({ lineRef }: DrawableRoute) =>
                    uniqueLines.map(({ id }: Line) => id).includes(lineRef) &&
                    !hiddenRealtimeDataLineRefs?.includes(lineRef),
            )
            .map(({ pointsOnLink, mode }: DrawableRoute) => ({
                points: polyline.decode(pointsOnLink),
                color: getIconColor(
                    mode.toLowerCase() as TransportMode,
                    IconColorType.DEFAULT,
                ),
            }))
        return <LineOverlay routes={routesToDraw} />
    }, [
        permanentlyVisibleRoutesInMap,
        uniqueLines,
        hiddenRealtimeDataLineRefs,
        showRoutesInMap,
        hideRealtimeData,
    ])

    useEffect(() => {
        const newBounds = (mapRef.current
            ?.getMap()
            ?.getBounds()
            ?.toArray()
            ?.flat() || [0, 0, 0, 0]) as [number, number, number, number]

        setBounds(newBounds)
        setBoundingBox({
            minLat: newBounds[1],
            minLon: newBounds[0],
            maxLat: newBounds[3],
            maxLon: newBounds[2],
        })
    }, [mapRef, debouncedViewport])

    const scooterpoints = useMemo(
        () =>
            scooters?.map((scooter: UseMobility_VehicleFragment) => ({
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
            bikeRentalStations?.map((bikeRentalStation) => ({
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
        },
    })
    const realtimeVehicleMarkers = useMemo(
        () =>
            realtimeVehicles.map((vehicle) => (
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
                    />
                </Marker>
            )),
        [realtimeVehicles, hoveredVehicle],
    )

    const scooterClusterMarkers = useMemo(
        () =>
            scooterClusters.map((scooterCluster) => {
                const [slongitude, slatitude] =
                    scooterCluster.geometry.coordinates

                if (!slongitude || !slatitude) return null

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
                        className="map__scooter-marker"
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
            }),
        [scooterClusters],
    )

    const stopPlaceMarkers = useMemo(
        () =>
            stopPlaces?.map((stopPlace) => (
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
            )),
        [stopPlaces, walkTimes],
    )

    const stationClusterMarkers = useMemo(
        () =>
            stationClusters.map((stationCluster) => {
                const [slongitude, slatitude] =
                    stationCluster.geometry.coordinates

                if (!slongitude || !slatitude) return null

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
                        />
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
                    ? (newViewPort: Viewport): void => {
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
            {permanentlyDrawnRoutes}
            {hoveredRoute}
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
})

interface Props {
    stopPlaces?: StopPlaceWithDepartures[]
    bikeRentalStations?: UseRentalStations_StationFragment[]
    scooters?: UseMobility_VehicleFragment[]
    walkTimes?: Array<{ stopId: string; walkTime: number }>
    interactive: boolean
    mapStyle?: string | undefined
    latitude: number
    longitude: number
    zoom: number
}

export { Map }
