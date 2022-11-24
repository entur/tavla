import React from 'react'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { useStopPlaceIds } from '../../logic/use-stop-place-ids/useStopPlaceIds'
import { BusStopTile } from './components/BusStopTile/BusStopTile'
import './BusStopDashboard.scss'

const BusStopDashboard = (): JSX.Element | null => {
    const { stopPlaceIds } = useStopPlaceIds()

    return (
        <DashboardWrapper className="bus-stop">
            <div>
                {stopPlaceIds.map((stopPlaceId) => (
                    <div key={stopPlaceId}>
                        <BusStopTile stopPlaceId={stopPlaceId} />
                    </div>
                ))}
            </div>
        </DashboardWrapper>
    )
}

export { BusStopDashboard }
