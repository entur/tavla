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
    setHoveredVehicle: (realtimeVehicle: RealtimeVehicle | null) => void
    isHovered: boolean
}

const RealtimeVehicleTag = ({
    realtimeVehicle,
    setHoveredVehicle,
    isHovered,
}: Props): JSX.Element => (
    <Tooltip
        placement="top"
        content={<TooltipContent realtimeVehicle={realtimeVehicle} />}
        className={`map__realtime-vehicle-tag-tooltip ${
            isHovered ? 'visible' : ''
        }`}
        disableHoverListener={true}
        isOpen={true}
        showCloseButton={false}
    >
        <div
            className="map__realtime-vehicle-tag-circle-outer"
            onMouseEnter={() => setHoveredVehicle(realtimeVehicle)}
            onMouseLeave={() => setHoveredVehicle(null)}
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
            >
                {realtimeVehicle.line.publicCode}
            </div>
        </div>
    </Tooltip>
)

export default RealtimeVehicleTag
