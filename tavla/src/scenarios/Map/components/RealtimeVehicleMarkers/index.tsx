import React, { useMemo, useState } from 'react'
import { Marker } from 'react-map-gl'
import polyline from 'google-polyline'
import { useRealtimeVehicleData } from 'hooks/useRealtimeVehicleData'
import { BoundingBox } from 'graphql-generated/vehicles-v1'
import { getIconColor } from 'utils/icon'
import { TransportMode } from 'graphql-generated/journey-planner-v3'
import { useSettings } from 'settings/SettingsProvider'
import { RealtimeVehicle } from 'types/structs'
import { LineOverlay } from '../LineOverlay'
import { RealtimeVehicleTag } from '../RealtimeVehicleTag'
import classes from './RealtimeVehicleMarkers.module.scss'

function RealtimeVehicleMarkers({ boundingBox }: { boundingBox: BoundingBox }) {
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
                            'default',
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
