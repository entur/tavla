import React, { useMemo } from 'react'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { useStopPlacesWithDepartures, useWalkInfo } from '../../logic'
import { WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import { DepartureTile } from './DepartureTile/DepartureTile'
import './BusStopDashboard.scss'

function getWalkInfoForStopPlace(
    walkInfos: WalkInfo[],
    id: string,
): WalkInfo | undefined {
    return walkInfos?.find((walkInfo) => walkInfo.stopId === id)
}

const BusStopDashboard = (): JSX.Element | null => {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const walkInfoDestinations = useMemo(() => {
        if (!stopPlacesWithDepartures) return []
        return stopPlacesWithDepartures.map((dep) => ({
            ...dep,
            place: dep.id,
        }))
    }, [stopPlacesWithDepartures])

    const walkInfo = useWalkInfo(walkInfoDestinations)

    return (
        <DashboardWrapper
            className="busStop"
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="busStop__tiles">
                {(stopPlacesWithDepartures || []).map((stopPlace) => (
                    <div key={stopPlace.id}>
                        <DepartureTile
                            walkInfo={getWalkInfoForStopPlace(
                                walkInfo || [],
                                stopPlace.id,
                            )}
                            stopPlaceWithDepartures={stopPlace}
                        />
                    </div>
                ))}
            </div>
        </DashboardWrapper>
    )
}

export { BusStopDashboard }
