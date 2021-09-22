import React, { useEffect, useState } from 'react'
import './styles.scss'
import { Tooltip } from '@entur/tooltip'
import { colors } from '@entur/tokens'
import { LegMode, TransportMode } from '@entur/sdk'
import { differenceInSeconds, parseISO } from 'date-fns'

import { getIcon, getIconColor } from '../../../utils'
import DepartureIcon from '../../../dashboards/Map/DepartureTag/DepartureIcon'
import { IconColorType } from '../../../types'
import { ITest } from '../test'
import { Vehicle } from '../../../services/model/vehicle'
import { Label } from '@entur/typography'

interface IProps {
    liveVehicle: Vehicle
    lineData: ITest | undefined
}

const getLastUpdated = (lastUpdated: string): number =>
    differenceInSeconds(new Date(), parseISO(lastUpdated))

export const LiveVehicleMarker = ({
    liveVehicle,
    lineData,
}: IProps): JSX.Element => (
    <Tooltip
        placement="top"
        content={
            <TooltipContent liveVehicle={liveVehicle} lineData={lineData} />
        }
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
                {lineData?.journeyPatterns[0].line.publicCode}
            </div>
        </div>
    </Tooltip>
)

const TooltipContent = ({ liveVehicle, lineData }: IProps) => {
    const [lastUpdated, setLastUpdated] = useState(
        getLastUpdated(liveVehicle.lastUpdated),
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(getLastUpdated(liveVehicle.lastUpdated))
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [liveVehicle.lastUpdated])

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
                    routeNumber={
                        lineData?.journeyPatterns[0].line.publicCode ?? '69'
                    }
                />
                <div className="front-text">
                    {liveVehicle.line.lineName.split('=> ').pop()}
                </div>
            </div>
            <Label
                className="second-line"
                margin="none"
            >{`${lastUpdated} seconds ago`}</Label>
        </div>
    )
}
