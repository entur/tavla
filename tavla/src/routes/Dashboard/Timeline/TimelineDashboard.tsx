import React from 'react'
import { DashboardWrapper } from 'scenarios/DashboardWrapper'
import { useStopPlaceIds } from 'hooks/useStopPlaceIds'
import { TimelineTile } from './TimelineTile/TimelineTile'
import classes from './TimelineDashboard.module.scss'

function TimelineDashboard() {
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
