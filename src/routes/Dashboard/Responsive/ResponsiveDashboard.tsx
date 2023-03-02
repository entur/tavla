import React from 'react'
import { DashboardWrapper } from 'scenarios/DashboardWrapper'
import { useStopPlaceIds } from 'hooks/use-stop-place-ids/useStopPlaceIds'
import { ResponsiveDepartureTile } from './ResponsiveDepartureTile/ResponsiveDepartureTile'
import classes from './ResponsiveDashboard.module.scss'

function ResponsiveDashboard() {
    const { stopPlaceIds } = useStopPlaceIds()

    return (
        <DashboardWrapper className={classes.ResponsiveWrapper}>
            <div className={classes.Responsive}>
                {stopPlaceIds.map((id) => (
                    <ResponsiveDepartureTile key={id} stopPlaceId={id} />
                ))}
            </div>
        </DashboardWrapper>
    )
}

export { ResponsiveDashboard }
