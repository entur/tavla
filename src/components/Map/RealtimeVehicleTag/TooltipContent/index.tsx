import React, { useEffect, useState } from 'react'
import './styles.scss'

import { colors } from '@entur/tokens'
import { TransportMode } from '@entur/sdk'
import { Label } from '@entur/typography'

import DepartureIcon from '../../../../dashboards/Map/DepartureTag/DepartureIcon'
import {
    getIcon,
    getIconColor,
    getLastUpdated,
    getFeedbackString,
} from '../../../../utils'

import { IconColorType } from '../../../../types'
import { RealtimeVehicle } from '../../../../services/realtimeVehicles/types/realtimeVehicle'

interface Props {
    realtimeVehicle: RealtimeVehicle
}
const TooltipContent = ({ realtimeVehicle }: Props): JSX.Element => {
    const [lastUpdated, setLastUpdated] = useState(
        getLastUpdated(realtimeVehicle.lastUpdated),
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(getLastUpdated(realtimeVehicle.lastUpdated))
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [realtimeVehicle.lastUpdated])

    return (
        <div className="map__realtime-vehicle-tag__tooltip-content-wrapper">
            <div className="map__realtime-vehicle-tag__tooltip-content-first-row">
                <DepartureIcon
                    icon={getIcon(
                        realtimeVehicle.mode.toLowerCase() as TransportMode,
                        undefined,
                        undefined,
                        colors.brand.white,
                    )}
                    color={getIconColor(
                        realtimeVehicle.mode.toLowerCase() as TransportMode,
                        IconColorType.DEFAULT,
                        undefined,
                    )}
                    routeNumber={realtimeVehicle.line.publicCode ?? ''}
                />
                <div className="map__realtime-vehicle-tag__tooltip-content-front-text">
                    {realtimeVehicle.line.lineName.split('=>').pop()?.trim()}
                </div>
            </div>
            <Label
                className="map__realtime-vehicle-tag__tooltip-content-second-row"
                margin="none"
            >
                {getFeedbackString(lastUpdated)}
            </Label>
        </div>
    )
}

export default TooltipContent
