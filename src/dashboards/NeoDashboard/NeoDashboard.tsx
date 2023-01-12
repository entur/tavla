import React from 'react'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { useStopPlaceIds } from '../../logic/use-stop-place-ids/useStopPlaceIds'
import { NeoDepartureTile } from './NeoDepartureTile/NeoDepartureTile'
import classes from './NeoDashboard.module.scss'

const NeoDashboard = () => {
    const { stopPlaceIds } = useStopPlaceIds()

    return (
        <DashboardWrapper className={classes.NeoWrapper}>
            <div className={classes.Neo}>
                {stopPlaceIds.map((id) => (
                    <NeoDepartureTile key={id} stopPlaceId={id} />
                ))}
            </div>
        </DashboardWrapper>
    )
}

export { NeoDashboard }
