import React from 'react'
import { DashboardWrapper } from 'containers/DashboardWrapper/DashboardWrapper'
import { useStopPlaceIds } from 'logic/use-stop-place-ids/useStopPlaceIds'
import { ResponsiveDepartureTile } from './ResponsiveDepartureTile/ResponsiveDepartureTile'
import classes from './ResponsiveDashboard.module.scss'

const ResponsiveDashboard = () => {
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
