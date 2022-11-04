import React, { useMemo } from 'react'
import { Loader } from '@entur/loader'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { BREAKPOINTS } from '../../constants'
import { useStopPlacesWithDepartures, useWalkInfo } from '../../logic'
import { WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import { useSettings } from '../../settings/SettingsProvider'
import { DepartureTile } from './DepartureTile/DepartureTile'
import './BusStopDashboard.scss'

function getWalkInfoForStopPlace(
    walkInfos: WalkInfo[],
    id: string,
): WalkInfo | undefined {
    return walkInfos?.find((walkInfo) => walkInfo.stopId === id)
}

const BusStopDashboard = (): JSX.Element | null => {
    const [settings] = useSettings()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const walkInfoDestinations = useMemo(() => {
        if (!stopPlacesWithDepartures) return []
        return stopPlacesWithDepartures.map((dep) => ({
            ...dep,
            place: dep.id,
        }))
    }, [stopPlacesWithDepartures])

    const walkInfo = useWalkInfo(walkInfoDestinations)

    const stopPlacesHasLoaded = Boolean(
        stopPlacesWithDepartures ||
            settings?.hiddenModes?.includes('kollektiv'),
    )

    if (window.innerWidth < BREAKPOINTS.md) {
        const numberOfTileRows = 10

        return (
            <DashboardWrapper
                className="busStop"
                stopPlacesWithDepartures={stopPlacesWithDepartures}
            >
                <div className="busStop__tiles">
                    small
                    {stopPlacesWithDepartures?.map((stopPlace) => (
                        <div key={stopPlace.id}>
                            <DepartureTile
                                walkInfo={getWalkInfoForStopPlace(
                                    walkInfo || [],
                                    stopPlace.id,
                                )}
                                stopPlaceWithDepartures={stopPlace}
                                isMobile
                                numberOfTileRows={numberOfTileRows}
                            />
                        </div>
                    ))}
                </div>
            </DashboardWrapper>
        )
    }
    return (
        <DashboardWrapper
            className="busStop"
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            {!stopPlacesHasLoaded ? (
                <div className="busStop__loading-screen">
                    <Loader>Laster inn</Loader>
                </div>
            ) : (
                <div className="busStop__tiles">
                    large
                    {(stopPlacesWithDepartures || []).map((stop, index) => (
                        <div key={stop.id}>
                            <DepartureTile
                                key={index.toString()}
                                stopPlaceWithDepartures={stop}
                                walkInfo={getWalkInfoForStopPlace(
                                    walkInfo || [],
                                    stop.id,
                                )}
                            />
                        </div>
                    ))}
                </div>
            )}
        </DashboardWrapper>
    )
}

export { BusStopDashboard }
