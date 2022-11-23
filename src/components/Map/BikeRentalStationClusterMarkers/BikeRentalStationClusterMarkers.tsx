import React, { useMemo } from 'react'
import { Marker } from 'react-map-gl'
import useSupercluster from 'use-supercluster'
import { BikeRentalStationTag } from '../BikeRentalStationTag/BikeRentalStationTag'
import { useRentalStations } from '../../../logic'
import { FormFactor } from '../../../../graphql-generated/mobility-v2'
import classes from './BikeRentalStationClusterMarkers.module.scss'

interface Props {
    zoom: number
    bounds: [number, number, number, number]
}

const BikeRentalStationClusterMarkers: React.FC<Props> = ({ zoom, bounds }) => {
    const bikeRentalStations = useRentalStations(true, FormFactor.Bicycle)

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

    const { clusters } = useSupercluster({
        points: bikeRentalStationPoints,
        bounds,
        zoom,
        options: {
            radius: 45,
            maxZoom: 18,
            // This fixes the issue where clusters don't have any bike/space info, but it creates a render loop
            // reduce: (acc, props) => {
            //     acc.bikesAvailable += props.bikesAvailable
            //     acc.spacesAvailable += props.spacesAvailable
            // },
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
                            spaces={
                                stationCluster.properties.spacesAvailable ?? 0
                            }
                        />
                    </Marker>
                )
            }),
        [clusters],
    )

    return <>{markers}</>
}

export { BikeRentalStationClusterMarkers }
