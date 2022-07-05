import React, { useState, memo, useEffect, useRef, useCallback } from 'react'

import ReactMapGL, { MapRef, Marker, Source, Layer } from 'react-map-gl'
import type { LayerProps } from 'react-map-gl'

import splitbee from '@splitbee/web'

import { Station, Vehicle } from '@entur/sdk/lib/mobility/types'

import PositionPin from '../../assets/icons/positionPin'

import { StopPlaceWithDepartures, Viewport } from '../../types'

import Voi from '../../assets/logos/Voi.svg'
import Tier from '../../assets/logos/Tier.svg'
import Bolt from '../../assets/logos/Bolt.svg'

import BicycleParkIcon from '../../assets/logos/BicyclePark.svg'
import BicycleIcon from '../../assets/logos/Bicycles.svg'
import BicycleBackground from '../../assets/logos/Bicycle_background.svg'

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

    const mapRef = useRef<MapRef>(null)

    const onMapLoad = () => {
        const map: mapboxgl.Map | undefined = mapRef.current?.getMap()
        if (!map) return

        const voiImg = new Image(20, 20)
        const tierImg = new Image(20, 20)
        const boltImg = new Image(20, 20)

        const bicyleBackgroundImg = new Image(40, 40)
        const bicycleParkIcon = new Image(20, 20)
        const bicycleIcon = new Image(20, 20)

        voiImg.onload = () => map.addImage('Voi', voiImg)
        tierImg.onload = () => map.addImage('Tier', tierImg)
        boltImg.onload = () => map.addImage('Bolt', boltImg)

        bicyleBackgroundImg.onload = () =>
            map.addImage('BicycleBackground', bicyleBackgroundImg)
        bicycleParkIcon.onload = () =>
            map.addImage('BicycleParkIcon', bicycleParkIcon)
        bicycleIcon.onload = () => map.addImage('BicycleIcon', bicycleIcon)

        voiImg.src = Voi
        tierImg.src = Tier
        boltImg.src = Bolt

        bicyleBackgroundImg.src = BicycleBackground
        bicycleParkIcon.src = BicycleParkIcon
        bicycleIcon.src = BicycleIcon
    }

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

    const scooterLayers =
        scooterPoints &&
        scooterPoints.map((scooter) => {
            const [slongitude, slatitude] = scooter.geometry.coordinates

            if (!slongitude || !slatitude) return null

            const { scooterId } = scooter.properties
            const name =
                scooter.properties.scooterOperator.name.translation[0].value

            const scooterLayer: LayerProps = {
                id: scooterId,
                type: 'symbol',
                layout: {
                    'icon-image': name,
                    'icon-allow-overlap': true,
                },
            }
            return (
                <Source key={scooterId} type="geojson" data={scooter}>
                    <Layer {...scooterLayer}></Layer>
                </Source>
            )
        })

    const stopPlaceMarkers =
        stopPlaces &&
        stopPlaces.map((stopPlace) => {
            if (!stopPlace.latitude || !stopPlace.longitude) return

            return (
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
            )
        })

    const stationClusterMarkers =
        bikeRentalStationsPoints &&
        bikeRentalStationsPoints.map((bikeRentalStation) => {
            const [slongitude, slatitude] =
                bikeRentalStation.geometry.coordinates

            if (!slongitude || !slatitude) return null

            const { stationId } = bikeRentalStation.properties

            const bikesAvailableLayer: LayerProps = {
                id: `layer-bikesAvailable-${stationId}`,
                type: 'symbol',

                layout: {
                    'text-field': ['get', 'bikesAvailable'],
                    'text-size': 12,
                    'text-allow-overlap': true,
                    'text-offset': [0.7, -0.7],
                },
                paint: {
                    'text-color': '#ffffff',
                },
            }
            const spacesAvailableLayer: LayerProps = {
                id: `layer-spaces-${stationId}`,
                type: 'symbol',

                layout: {
                    'text-field': ['get', 'spacesAvailable'],
                    'text-size': 12,
                    'text-allow-overlap': true,
                    'text-offset': [0.7, 0.6],
                },
                paint: {
                    'text-color': '#ffffff',
                },
            }

            const bicycleBackground: LayerProps = {
                id: `background-${stationId}`,
                type: 'symbol',
                layout: {
                    'icon-image': 'BicycleBackground',
                    'icon-allow-overlap': true,
                },
            }

            const bicycleIcon: LayerProps = {
                id: `bicycl-icon-${stationId}`,
                type: 'symbol',
                layout: {
                    'icon-image': 'BicycleIcon',
                    'icon-allow-overlap': true,
                    'icon-offset': [-10, -10],
                    'icon-size': 0.7,
                },
            }

            const bicycleParkIcon: LayerProps = {
                id: `park-icon-${stationId}`,
                type: 'symbol',
                layout: {
                    'icon-image': 'BicycleParkIcon',
                    'icon-allow-overlap': true,
                    'icon-offset': [-10, 10],
                    'icon-size': 0.7,
                },
            }

            return (
                <Source key={stationId} type="geojson" data={bikeRentalStation}>
                    <Layer {...bicycleBackground} />
                    <Layer {...bicycleIcon} />
                    <Layer {...bicycleParkIcon} />
                    <Layer {...bikesAvailableLayer} />
                    <Layer {...spacesAvailableLayer} />
                </Source>
            )
        })

    splitbee.track('MAP_RENDERED')
    console.log('Map render')

    return (
        <ReactMapGL
            ref={mapRef}
            onLoad={onMapLoad}
            {...viewport}
            mapboxAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle={process.env.MAPBOX_STYLE_MAPVIEW}
            reuseMaps
            crossSourceCollisions={false}
        >
            {scooterLayers}
            {stopPlaceMarkers}
            {stationClusterMarkers}
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
