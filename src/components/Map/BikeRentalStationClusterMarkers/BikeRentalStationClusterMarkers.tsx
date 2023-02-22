import React, { useMemo } from 'react'
import { Marker } from 'react-map-gl'
import useSupercluster from 'use-supercluster'
import { useRentalStations } from 'logic/use-rental-stations/useRentalStations'
import { FormFactor } from 'graphql-generated/mobility-v2'
import { BikeRentalStationTag } from '../BikeRentalStationTag/BikeRentalStationTag'
import classes from './BikeRentalStationClusterMarkers.module.scss'

function BikeRentalStationClusterMarkers({
    zoom,
    bounds,
}: {
    zoom: number
    bounds: [number, number, number, number]
}) {
    const { rentalStations } = useRentalStations([FormFactor.Bicycle])

    const bikeRentalStationPoints = useMemo(
        () =>
            rentalStations?.map((bikeRentalStation) => ({
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
        [rentalStations],
    )

    const { clusters } = useSupercluster({
        points: bikeRentalStationPoints,
        bounds,
        zoom,
        options: {
            radius: 45,
            maxZoom: 18,
        },
    })

    const markers = useMemo(
        () =>
            clusters.map((stationCluster) => {
                const [longitude, latitude] =
                    stationCluster.geometry.coordinates

                if (!longitude || !latitude) return null

                return (
                    <Marker
                        key={
                            stationCluster.properties.cluster
                                ? stationCluster.id
                                : stationCluster.properties.stationId
                        }
                        latitude={latitude}
                        longitude={longitude}
                        marker-size="large"
                        className={classes.BikeRentalStationClusterMarker}
                    >
                        <BikeRentalStationTag
                            bikes={stationCluster.properties.bikesAvailable}
                            spaces={stationCluster.properties.spacesAvailable}
                        />
                    </Marker>
                )
            }),
        [clusters],
    )

    return <>{markers}</>
}

export { BikeRentalStationClusterMarkers }
