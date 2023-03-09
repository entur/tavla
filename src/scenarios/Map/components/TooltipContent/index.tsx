import React, { useEffect, useState } from 'react'
import { DepartureIcon } from 'src/routes/Dashboard/Map/DepartureIcon/DepartureIcon'
import { getFeedbackString, getLastUpdated } from 'utils/time'
import { getIconColor } from 'utils/icon'
import { TransportMode } from 'graphql-generated/journey-planner-v3'
import { TransportModeIcon } from 'assets/icons/TransportModeIcon'
import { RealtimeVehicle } from 'types/structs'
import { Label } from '@entur/typography'
import { colors } from '@entur/tokens'
import classes from './TooltipContent.module.scss'

function TooltipContent({
    realtimeVehicle,
}: {
    realtimeVehicle: RealtimeVehicle
}) {
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
        <div className={classes.Wrapper}>
            <div className={classes.FirstRow}>
                <DepartureIcon
                    icon={
                        <TransportModeIcon
                            transportMode={
                                realtimeVehicle.mode.toLowerCase() as TransportMode
                            }
                            color={colors.brand.white}
                        />
                    }
                    color={getIconColor(
                        realtimeVehicle.mode.toLowerCase() as TransportMode,
                        'default',
                        undefined,
                    )}
                    routeNumber={realtimeVehicle.line.publicCode ?? ''}
                />
                <div className={classes.FrontText}>
                    {realtimeVehicle.line.lineName?.split('=>').pop()?.trim()}
                </div>
            </div>
            <Label className={classes.SecondRow} margin="none">
                {getFeedbackString(lastUpdated)}
            </Label>
        </div>
    )
}

export { TooltipContent }
