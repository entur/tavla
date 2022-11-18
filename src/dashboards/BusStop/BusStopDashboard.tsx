import React from 'react'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { useAllStopPlaceIds } from '../../logic/use-all-stop-place-ids/useAllStopPlaceIds'
import { StopPlaceWithDepartures } from '../../types'
import { BusStopTile } from './components/BusStopTile/BusStopTile'
import './BusStopDashboard.scss'

const BusStopDashboard = (): JSX.Element | null => {
    const { allStopPlaceIds } = useAllStopPlaceIds()

    return (
        <DashboardWrapper
            className="bus-stop"
            // Workaround to bypass loading/no stop found
            stopPlacesWithDepartures={[{} as StopPlaceWithDepartures]}
        >
            <div>
                {(allStopPlaceIds || []).map((stopPlaceId) => (
                    <div key={stopPlaceId}>
                        <BusStopTile stopPlaceId={stopPlaceId} />
                    </div>
                ))}
            </div>
        </DashboardWrapper>
    )
}

export { BusStopDashboard }
