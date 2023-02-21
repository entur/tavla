import React, { useMemo, useState } from 'react'
import { Marker } from 'react-map-gl'
import polyline from 'google-polyline'
import { useRealtimeVehicleData } from 'hooks/use-realtime-vehicle-data/useRealtimeVehicleData'
import { BoundingBox } from 'graphql-generated/vehicles-v1'
import { RealtimeVehicle } from 'hooks/use-realtime-vehicle-data/types'
import { getIconColor } from 'utils/icon'
import { TransportMode } from 'graphql-generated/journey-planner-v3'
import { IconColorType } from 'src/types'
import { useSettings } from 'settings/SettingsProvider'
import { LineOverlay } from '../RealtimeVehicleTag/LineOverlay/LineOverlay'
import { RealtimeVehicleTag } from '../RealtimeVehicleTag/RealtimeVehicleTag'
import classes from './RealtimeVehicleMarkers.module.scss'

interface Props {
    boundingBox: BoundingBox
}

const RealtimeVehicleMarkers: React.FC<Props> = ({ boundingBox }) => {
    const [settings] = useSettings()
    const realtimeVehicles = useRealtimeVehicleData(boundingBox)

    const [hoveredVehicle, setHoveredVehicle] = useState<
        RealtimeVehicle | undefined
    >(undefined)

    const realtimeVehicleMarkers = useMemo(
        () =>
            realtimeVehicles.map((vehicle) => (
                <Marker
                    key={vehicle.vehicleRef}
                    latitude={vehicle.location.latitude}
                    longitude={vehicle.location.longitude}
                    className={classes.RealtimeVehicleMarker}
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

    const hoveredRoute = useMemo(() => {
        if (
            !hoveredVehicle ||
            !hoveredVehicle.line.pointsOnLink ||
            !settings.showRoutesInMap
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
    }, [hoveredVehicle, settings.showRoutesInMap])

    return (
        <>
            {realtimeVehicleMarkers}
            {hoveredRoute}
        </>
    )
}

export { RealtimeVehicleMarkers }
