import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '@entur/loader'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { BREAKPOINTS } from '../../constants'
import { useStopPlacesWithDepartures, useWalkInfo } from '../../logic'
import { WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import { getFromLocalStorage } from '../../settings/LocalStorage'
import { useSettings } from '../../settings/SettingsProvider'
import { Item } from '../../components/RearrangeModal/RearrangeModal'
import { isEqualUnsorted } from '../../utils/array'
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

    const { documentId: boardId } = useParams<{ documentId: string }>()

    const [tileOrder, setTileOrder] = useState<Item[] | undefined>(
        boardId ? getFromLocalStorage(boardId + '-tile-order') : undefined,
    )

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

    useEffect(() => {
        let defaultTileOrder: Item[] = []
        if (stopPlacesWithDepartures) {
            const filtered = stopPlacesWithDepartures.map((item) => ({
                id: item.id,
                name: item.name,
            }))
            defaultTileOrder = filtered
        }
        const storedTileOrder: Item[] | undefined = getFromLocalStorage(
            boardId + '-tile-order',
        )
        if (
            storedTileOrder &&
            storedTileOrder.length === defaultTileOrder.length &&
            isEqualUnsorted(
                defaultTileOrder.map((item) => item.id),
                storedTileOrder.map((item) => item.id),
            )
        ) {
            setTileOrder(storedTileOrder)
        } else {
            setTileOrder(defaultTileOrder)
        }
    }, [stopPlacesWithDepartures, boardId])

    if (window.innerWidth < BREAKPOINTS.md) {
        const numberOfTileRows = 10

        if (!tileOrder) return null

        return (
            <DashboardWrapper
                className="busStop"
                stopPlacesWithDepartures={stopPlacesWithDepartures}
            >
                <div className="busStop__tiles">
                    {tileOrder.map((item) => {
                        if (stopPlacesWithDepartures) {
                            const stopIndex =
                                stopPlacesWithDepartures.findIndex(
                                    (p) => p.id == item.id,
                                )

                            const stopPlace =
                                stopPlacesWithDepartures[stopIndex]

                            if (!stopPlace) return null
                            return (
                                <div key={item.id}>
                                    <DepartureTile
                                        walkInfo={getWalkInfoForStopPlace(
                                            walkInfo || [],
                                            item.id,
                                        )}
                                        stopPlaceWithDepartures={stopPlace}
                                        isMobile
                                        numberOfTileRows={numberOfTileRows}
                                    />
                                </div>
                            )
                        }
                    })}
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
