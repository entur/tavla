import React from 'react'
import './styles.scss'

import { Tooltip } from '@entur/tooltip'
import { colors } from '@entur/tokens'
import { LegMode, TransportMode } from '@entur/sdk'

import { getIconColor } from '../../../utils'
import { IconColorType } from '../../../types'

import { LiveVehicle } from '../../../logic/useVehicleData'

import TooltipContent from './TooltipContent'

interface IProps {
    liveVehicle: LiveVehicle
}

const LiveVehicleTag = ({ liveVehicle }: IProps): JSX.Element => (
    <Tooltip
        placement="top"
        content={<TooltipContent liveVehicle={liveVehicle} />}
    >
        <div
            className="map__live-vehicle-tag-circle-outer"
            style={
                liveVehicle.active
                    ? { backgroundColor: 'white' }
                    : { backgroundColor: colors.greys.grey30 }
            }
        >
            <div
                className="map__live-vehicle-tag-circle-inner"
                style={
                    liveVehicle.active
                        ? {
                              backgroundColor: getIconColor(
                                  liveVehicle.mode.toLowerCase() as
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
                {liveVehicle.lineIdentifier}
            </div>
        </div>
    </Tooltip>
)

export default LiveVehicleTag
