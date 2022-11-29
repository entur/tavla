import React, { useMemo } from 'react'
import { Marker } from 'react-map-gl'
import useSupercluster from 'use-supercluster'
import type { ClusterProperties } from 'supercluster'
import { ScooterMarkerTag } from '../ScooterMarkerTag/ScooterMarkerTag'
import { FormFactor } from '../../../../graphql-generated/mobility-v2'
import { useVehicles } from '../../../logic/use-vehicles/useVehicles'
import { useSettings } from '../../../settings/SettingsProvider'
import classes from './ScooterClusterMarkers.module.scss'

interface Props {
    zoom: number
    bounds: [number, number, number, number]
}

const ScooterClusterMarkers: React.FC<Props> = ({ zoom, bounds }) => {
    const [settings] = useSettings()

    const distance = settings.scooterDistance.enabled
        ? settings.scooterDistance.distance
        : settings.distance

    const { vehicles } = useVehicles(distance, [FormFactor.Scooter])

    const points = useMemo(
        () =>
            vehicles.map((scooter) => ({
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
        [vehicles],
    )

    const { clusters } = useSupercluster({
        points,
        bounds,
        zoom,
        options: { radius: 38, maxZoom: 18 },
    })

    const markers = useMemo(
        () =>
            clusters.map((scooterCluster) => {
                const [longitude, latitude] =
                    scooterCluster.geometry.coordinates

                if (!longitude || !latitude) return null

                let pointCount = 0
                if (scooterCluster.properties.cluster) {
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
                        latitude={latitude}
                        longitude={longitude}
                        className={classes.ScooterClusterMarker}
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
        [clusters],
    )

    return <>{markers}</>
}

export { ScooterClusterMarkers }
