import React, { useMemo } from 'react'
import { Marker } from 'react-map-gl'
import classNames from 'classnames'
import { uniq } from 'lodash'
import { useStopPlaceWithEstimatedCalls } from 'hooks/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import { getIconColor } from 'utils/icon'
import { TransportModeIcon } from 'assets/icons/TransportModeIcon'
import { WalkTrip } from 'components/WalkTrip/WalkTrip'
import { colors } from '@entur/tokens'
import classes from './StopPlaceMarker.module.scss'

function StopPlaceMarker({
    className,
    stopPlaceId,
}: {
    stopPlaceId: string
    className?: string
}) {
    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({ stopPlaceId })

    const uniqueTransportMode = useMemo(
        () =>
            uniq(
                stopPlaceWithEstimatedCalls?.estimatedCalls.map(
                    (ec) => ec.serviceJourney.journeyPattern.line.transportMode,
                ),
            ),
        [stopPlaceWithEstimatedCalls?.estimatedCalls],
    )

    if (!stopPlaceWithEstimatedCalls || loading) return null

    return (
        <Marker
            latitude={stopPlaceWithEstimatedCalls.latitude}
            longitude={stopPlaceWithEstimatedCalls.longitude}
            offsetLeft={-50}
            offsetTop={-10}
            className={classNames(classes.StopPlaceMarker, className)}
        >
            <div className={classes.StopPlaceTag}>
                <div className={classes.IconRow}>
                    {uniqueTransportMode.map((transportMode) => (
                        <div
                            key={transportMode}
                            className={classes.Icon}
                            style={{
                                backgroundColor: getIconColor(
                                    transportMode,
                                    'default',
                                    undefined,
                                ),
                            }}
                        >
                            <TransportModeIcon
                                transportMode={transportMode}
                                color={colors.brand.white}
                            />
                        </div>
                    ))}
                </div>
                <div className={classes.StopPlace}>
                    {stopPlaceWithEstimatedCalls.name}
                </div>
                <WalkTrip
                    className={classes.WalkingDistance}
                    coordinates={{
                        longitude: stopPlaceWithEstimatedCalls.longitude,
                        latitude: stopPlaceWithEstimatedCalls.latitude,
                    }}
                />
            </div>
        </Marker>
    )
}

export { StopPlaceMarker }
