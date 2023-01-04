import React from 'react'
import { StopPlaceWithDepartures } from '../../types'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { useAllStopPlaceIds } from '../../logic/use-all-stop-place-ids/useAllStopPlaceIds'
import { TimelineTile } from './TimelineTile/TimelineTile'
import classes from './TimelineDashboard.module.scss'

const TimelineDashboard = (): JSX.Element | null => {
    const { allStopPlaceIds } = useAllStopPlaceIds()

    return (
        <DashboardWrapper
            className={classes.TimelineDashboard}
            stopPlacesWithDepartures={[{} as StopPlaceWithDepartures]}
        >
            {allStopPlaceIds.map((stopPlaceId) => (
                <TimelineTile key={stopPlaceId} stopPlaceId={stopPlaceId} />
            ))}
        </DashboardWrapper>
    )
}

export { TimelineDashboard }
