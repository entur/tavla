import React from 'react'
import { DashboardWrapper } from 'scenarios/DashboardWrapper'
import { useStopPlaceIds } from 'hooks/use-stop-place-ids/useStopPlaceIds'
import { BusStopTile } from './components/BusStopTile/BusStopTile'

function BusStopDashboard() {
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
