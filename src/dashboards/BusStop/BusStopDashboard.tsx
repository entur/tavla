import React, { useState, useEffect, useMemo } from 'react'
import { Layouts, Layout, WidthProvider, Responsive } from 'react-grid-layout'
import { useLocation, useParams } from 'react-router-dom'
import { Loader } from '@entur/loader'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { BREAKPOINTS } from '../../constants'
import { useStopPlacesWithDepartures, useWalkInfo } from '../../logic'
import { WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'
import { useSettings } from '../../settings/SettingsProvider'
import { Item } from '../../components/RearrangeModal/RearrangeModal'
import { isEqualUnsorted } from '../../utils/array'
import { DepartureTile } from './DepartureTile/DepartureTile'
import './BusStopDashboard.scss'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

function getDefaultBreakpoint() {
    if (window.innerWidth > BREAKPOINTS.lg) {
        return 'lg'
    } else if (window.innerWidth > BREAKPOINTS.md) {
        return 'md'
    }
    return 'sm'
}

const COLS: { [key: string]: number } = {
    lg: 1,
    md: 1,
    sm: 1,
    xs: 1,
    xxs: 1,
}
function getWalkInfoForStopPlace(
    walkInfos: WalkInfo[],
    id: string,
): WalkInfo | undefined {
    return walkInfos?.find((walkInfo) => walkInfo.stopId === id)
}

function getDataGrid(
    index: number,
    maxWidth: number,
): { [key: string]: number } {
    return {
        w: 1,
        maxW: maxWidth,
        minH: 1,
        h: 6,
        x: index % maxWidth,
        y: 0,
    }
}

const BusStopDashboard = (): JSX.Element | null => {
    const [settings] = useSettings()
    const location = useLocation()
    const [breakpoint, setBreakpoint] = useState<string>(getDefaultBreakpoint())
    const [numberOfStopPlaces, setNumberOfStopPlaces] = useState<number>(0)
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const dashboardKey = location.key

    const { documentId: boardId } = useParams<{ documentId: string }>()

    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey as string),
    )
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

    const maxWidthCols = COLS[breakpoint] || 1
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
            setNumberOfStopPlaces(filtered.length)
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
                    <ResponsiveReactGridLayout
                        key={breakpoint}
                        breakpoints={BREAKPOINTS}
                        cols={COLS}
                        layouts={gridLayouts}
                        margin={[32, 32]}
                        isDraggable={false}
                        onBreakpointChange={(newBreakpoint: string) => {
                            setBreakpoint(newBreakpoint)
                        }}
                        onLayoutChange={(
                            layout: Layout[],
                            layouts: Layouts,
                        ): void => {
                            if (numberOfStopPlaces > 0) {
                                setGridLayouts(layouts)
                                saveToLocalStorage(
                                    dashboardKey as string,
                                    layouts,
                                )
                            }
                        }}
                    >
                        {(stopPlacesWithDepartures || []).map((stop, index) => (
                            <div
                                key={stop.id}
                                data-grid={getDataGrid(index, maxWidthCols)}
                            >
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
                    </ResponsiveReactGridLayout>
                </div>
            )}
        </DashboardWrapper>
    )
}

export { BusStopDashboard }
