import React, { useEffect, useState } from 'react'
import './styles.scss'

import { differenceInSeconds, parseISO } from 'date-fns'

import { colors } from '@entur/tokens'
import { TransportMode } from '@entur/sdk'
import { Label } from '@entur/typography'

import DepartureIcon from '../../../../dashboards/Map/DepartureTag/DepartureIcon'
import { getIcon, getIconColor } from '../../../../utils'

import { IconColorType } from '../../../../types'
import { LiveVehicle } from '../../../../logic/useVehicleData'

const getFeedbackString = (lastUpdated: number) => {
    if (lastUpdated < 60) return `${lastUpdated} seconds ago`
    if (lastUpdated < 120) return '> 1 minute ago'
    return ` > ${Math.floor(lastUpdated / 60)} minutes ago`
}

const getLastUpdated = (lastUpdated: string): number =>
    differenceInSeconds(new Date(), parseISO(lastUpdated))

interface IProps {
    liveVehicle: LiveVehicle
}
const TooltipContent = ({ liveVehicle }: IProps): JSX.Element => {
    const [lastUpdated, setLastUpdated] = useState(
        getLastUpdated(liveVehicle.vehicle.lastUpdated),
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(getLastUpdated(liveVehicle.vehicle.lastUpdated))
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [liveVehicle.vehicle.lastUpdated])

    return (
        <div className="map__live-vehicle-tag__tooltip-content-wrapper">
            <div className="map__live-vehicle-tag__tooltip-content-first-row">
                <DepartureIcon
                    icon={getIcon(
                        liveVehicle.mode.toLowerCase() as TransportMode,
                        undefined,
                        undefined,
                        colors.brand.white,
                    )}
                    color={getIconColor(
                        liveVehicle.mode.toLowerCase() as TransportMode,
                        IconColorType.DEFAULT,
                        undefined,
                    )}
                    routeNumber={liveVehicle.lineIdentifier ?? '69'}
                />
                <div className="map__live-vehicle-tag__tooltip-content-front-text">
                    {liveVehicle.destination}
                </div>
            </div>
            <Label
                className="map__live-vehicle-tag__tooltip-content-second-row"
                margin="none"
            >
                {getFeedbackString(lastUpdated)}
            </Label>
        </div>
    )
}

export default TooltipContent
