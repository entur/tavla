import React from 'react'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { useStopPlaceIds } from '../../logic/use-stop-place-ids/useStopPlaceIds'
import { TimelineTile } from './TimelineTile/TimelineTile'
import classes from './TimelineDashboard.module.scss'

const TimelineDashboard = (): JSX.Element | null => {
    const { stopPlaceIds } = useStopPlaceIds()

    return (
        <DashboardWrapper className={classes.TimelineDashboard}>
            {stopPlaceIds.map((stopPlaceId) => (
                <TimelineTile key={stopPlaceId} stopPlaceId={stopPlaceId} />
            ))}
        </DashboardWrapper>
    )
}

export { TimelineDashboard }
