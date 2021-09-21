import React from 'react'
import './styles.scss'
import { Tooltip } from '@entur/tooltip'
import { getIcon, getIconColor } from '../../../utils'
import { TransportMode, TransportSubmode } from '@entur/sdk'
import { colors } from '@entur/tokens'
import DepartureIcon from '../../../dashboards/Map/DepartureTag/DepartureIcon'
import { IconColorType } from '../../../types'

interface IProps {
    lineNumber: string
    color: string
    mode: string
}

export const LiveVehicleMarker = ({
    lineNumber,
    mode,
    color,
}: IProps): JSX.Element => (
    <Tooltip
        placement="top"
        content={<TooltipContent mode={mode} lineNumber={lineNumber} />}
    >
        <div className="wrapper_outer">
            <div className="wrapper_inner" style={{ backgroundColor: color }}>
                {lineNumber}
            </div>
        </div>
    </Tooltip>
)

const TooltipContent = ({ lineNumber, mode }: IToolTipContentProps) => (
    <div className="ttc-wrapper">
        <div className="first-line">
            <DepartureIcon
                icon={getIcon(
                    mode as TransportMode,
                    undefined,
                    undefined,
                    colors.brand.white,
                )}
                color={getIconColor(
                    mode as TransportMode,
                    IconColorType.DEFAULT,
                    undefined,
                )}
                routeNumber={lineNumber}
            />
        </div>
        <div className="second-line"></div>
    </div>
)

interface IToolTipContentProps {
    lineNumber: string
    mode: string
}
