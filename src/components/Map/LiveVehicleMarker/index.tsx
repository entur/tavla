import React, { useEffect, useState } from 'react'
import './styles.scss'
import { Label } from '@entur/typography'
import { Tooltip } from '@entur/tooltip'
import { colors } from '@entur/tokens'
import { LegMode, TransportMode } from '@entur/sdk'
import { differenceInSeconds, parseISO } from 'date-fns'

import { getIcon, getIconColor } from '../../../utils'
import DepartureIcon from '../../../dashboards/Map/DepartureTag/DepartureIcon'
import { IconColorType } from '../../../types'

import { LiveVehicle } from '../../../logic/useVehicleData'

interface Props {
    liveVehicle: LiveVehicle
}

const getLastUpdated = (lastUpdated: string): number =>
    differenceInSeconds(new Date(), parseISO(lastUpdated))

export const LiveVehicleMarker = ({ liveVehicle }: Props): JSX.Element => (
    <Tooltip
        placement="top"
        content={<TooltipContent liveVehicle={liveVehicle} />}
    >
        <div className="wrapper_outer">
            <div
                className="wrapper_inner"
                style={{
                    backgroundColor: getIconColor(
                        liveVehicle.mode.toLowerCase() as
                            | TransportMode
                            | LegMode
                            | 'ferry',
                        IconColorType.DEFAULT,
                        undefined,
                    ),
                }}
            >
                {liveVehicle.lineIdentifier}
            </div>
        </div>
    </Tooltip>
)

const TooltipContent = ({ liveVehicle }: Props): JSX.Element => {
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
        <div className="ttc-wrapper">
            <div className="first-line">
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
                <div className="front-text">{liveVehicle.destination}</div>
            </div>
            <Label
                className="second-line"
                margin="none"
            >{`${lastUpdated} seconds ago`}</Label>
        </div>
    )
}
