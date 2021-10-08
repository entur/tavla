import React from 'react'

import { Tooltip } from '@entur/tooltip'
import { colors } from '@entur/tokens'
import { LegMode, TransportMode } from '@entur/sdk'

import { getIconColor } from '../../../utils'
import { IconColorType } from '../../../types'

import { RealtimeVehicle } from '../../../services/realtimeVehicles/types/realtimeVehicle'

import TooltipContent from './TooltipContent'
import './styles.scss'

interface Props {
    realtimeVehicle: RealtimeVehicle
}

const RealtimeVehicleTag = ({ realtimeVehicle }: Props): JSX.Element => {
    const handleMouseOver = () => {
        if (
            document.getElementById(realtimeVehicle.vehicleRef)?.classList &&
            !document
                .getElementById(realtimeVehicle.vehicleRef)
                ?.classList.contains('visible')
        )
            document
                .getElementById(realtimeVehicle.vehicleRef)
                ?.classList.add('visible')
    }

    const handleMouseOut = () => {
        if (
            document.getElementById(realtimeVehicle.vehicleRef)?.classList &&
            document
                .getElementById(realtimeVehicle.vehicleRef)
                ?.classList.contains('visible')
        )
            document
                .getElementById(realtimeVehicle.vehicleRef)
                ?.classList.remove('visible')
    }

    return (
        <Tooltip
            id={realtimeVehicle.vehicleRef}
            placement="top"
            content={<TooltipContent realtimeVehicle={realtimeVehicle} />}
            className="map__realtime-vehicle-tag-tooltip"
            disableHoverListener={true}
            isOpen={true}
            showCloseButton={false}
        >
            <div
                className="map__realtime-vehicle-tag-circle-outer"
                style={
                    realtimeVehicle.active
                        ? { backgroundColor: 'white' }
                        : { backgroundColor: colors.greys.grey30 }
                }
            >
                <div
                    className="map__realtime-vehicle-tag-circle-inner"
                    style={
                        realtimeVehicle.active
                            ? {
                                  backgroundColor: getIconColor(
                                      realtimeVehicle.mode.toLowerCase() as
                                          | TransportMode
                                          | LegMode
                                          | 'ferry',
                                      IconColorType.DEFAULT,
                                      undefined,
                                  ),
                              }
                            : { backgroundColor: colors.greys.grey30 }
                    }
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    {realtimeVehicle.line.publicCode}
                </div>
            </div>
        </Tooltip>
    )
}

export default RealtimeVehicleTag
