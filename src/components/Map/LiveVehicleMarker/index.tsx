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
        <div
            className="wrapper_outer"
            style={
                liveVehicle.active
                    ? { backgroundColor: 'white' }
                    : { backgroundColor: colors.greys.grey30 }
            }
        >
            <div
                className="wrapper_inner"
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
            <Label className="second-line" margin="none">
                {getFeedbackString(lastUpdated)}
            </Label>
        </div>
    )
}

const getFeedbackString = (lastUpdated: number) => {
    if (lastUpdated < 60) return `${lastUpdated} seconds ago`
    if (lastUpdated < 120) return '> 1 minute ago'
    return ` > ${Math.floor(lastUpdated / 60)} minutes ago`
}
