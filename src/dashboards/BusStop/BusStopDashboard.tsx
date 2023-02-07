import React from 'react'
import { DashboardWrapper } from 'containers/DashboardWrapper/DashboardWrapper'
import { useStopPlaceIds } from 'logic/use-stop-place-ids/useStopPlaceIds'
import { BusStopTile } from './components/BusStopTile/BusStopTile'
import classes from './BusStopDashboard.module.scss'

const BusStopDashboard = (): JSX.Element | null => {
    const { stopPlaceIds } = useStopPlaceIds()

    return (
        <DashboardWrapper className="bus-stop">
            <div>
                {stopPlaceIds.map((stopPlaceId) => (
                    <div
                        key={stopPlaceId}
                        className={classes.BusStopTileWrapper}
                    >
                        <BusStopTile stopPlaceId={stopPlaceId} />
                    </div>
                ))}
            </div>
        </DashboardWrapper>
    )
}

export { BusStopDashboard }
