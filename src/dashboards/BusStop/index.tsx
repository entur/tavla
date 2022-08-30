import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Layouts, Layout, WidthProvider, Responsive } from 'react-grid-layout'
import { useHistory, useRouteMatch } from 'react-router'

import { useLongPress } from 'use-long-press'

import { Loader } from '@entur/loader'

import { FormFactor } from '@entur/sdk/lib/mobility/types'

import { BREAKPOINTS, isEqualUnsorted } from '../../utils'
import DashboardWrapper from '../../containers/DashboardWrapper'

import { DEFAULT_ZOOM } from '../../constants'
import {
    useStopPlacesWithDepartures,
    useMobility,
    useWalkInfo,
    useBikeRentalStations,
} from '../../logic'
import { WalkInfo } from '../../logic/useWalkInfo'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'

import { useSettingsContext } from '../../settings'

import RearrangeModal, { Item } from '../../components/RearrangeModal'
import { LongPressProvider } from '../../logic/longPressContext'

import DepartureTile from './DepartureTile'

import MapTile from './MapTile'

import './styles.scss'

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

const BusStop = (): JSX.Element | null => {
    const [settings] = useSettingsContext()
    const history = useHistory()
    const [breakpoint, setBreakpoint] = useState<string>(getDefaultBreakpoint())
    const [isLongPressStarted, setIsLongPressStarted] = useState<boolean>(false)
    const isCancelled = useRef<NodeJS.Timeout>()
    const [modalVisible, setModalVisible] = useState(false)
    const [numberOfStopPlaces, setNumberOfStopPlaces] = useState<number>(0)
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const dashboardKey = history.location.key

    const boardId = useRouteMatch<{ documentId: string }>('/t/:documentId')
        ?.params?.documentId

    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey as string),
    )
    const [tileOrder, setTileOrder] = useState<Item[] | undefined>(
        boardId ? getFromLocalStorage(boardId + '-tile-order') : undefined,
    )

    const scooters = useMobility(FormFactor.SCOOTER)
    const bikeRentalStations = useBikeRentalStations()

    const walkInfoDestinations = useMemo(() => {
        if (!stopPlacesWithDepartures) return []
        return stopPlacesWithDepartures.map((dep) => ({
            ...dep,
            place: dep.id,
        }))
    }, [stopPlacesWithDepartures])
    const walkInfo = useWalkInfo(walkInfoDestinations)

    function clearLongPressTimeout() {
        setIsLongPressStarted(false)
        if (isCancelled.current) {
            clearTimeout(isCancelled.current)
        }
    }

    const mapCol = settings?.showMap ? 1 : 0
    const totalItems = numberOfStopPlaces + mapCol
    const hasData = Boolean(
        bikeRentalStations?.length ||
            scooters?.length ||
            stopPlacesWithDepartures?.length,
    )
    const maxWidthCols = COLS[breakpoint] || 1
    const stopPlacesHasLoaded = Boolean(
        stopPlacesWithDepartures ||
            settings?.hiddenModes?.includes('kollektiv'),
    )

    const bikeHasLoaded = Boolean(
        bikeRentalStations || settings?.hiddenModes?.includes('bysykkel'),
    )

    const scooterHasLoaded = Boolean(
        scooters || settings?.hiddenModes?.includes('sparkesykkel'),
    )

    const hasFetchedData = Boolean(
        stopPlacesHasLoaded && bikeHasLoaded && scooterHasLoaded,
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
        if (mapCol) {
            defaultTileOrder = [
                ...defaultTileOrder,
                { id: 'map', name: 'Kart' },
            ]
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
    }, [stopPlacesWithDepartures, mapCol, boardId])

    const longPress = useLongPress(
        () => {
            setModalVisible(true)
        },
        {
            threshold: 750,
            onStart: () => {
                isCancelled.current = setTimeout(() => {
                    setIsLongPressStarted(true)
                }, 150)
            },
            onFinish: () => {
                clearLongPressTimeout()
            },
            onCancel: () => {
                clearLongPressTimeout()
            },
            onMove: () => {
                clearLongPressTimeout()
            },
            cancelOnMovement: true,
        },
    )
    if (window.innerWidth < BREAKPOINTS.md) {
        const numberOfTileRows = 10

        if (!tileOrder) return null

        return (
            <DashboardWrapper
                className="busStop"
                bikeRentalStations={bikeRentalStations}
                stopPlacesWithDepartures={stopPlacesWithDepartures}
                scooters={scooters}
            >
                <LongPressProvider value={isLongPressStarted}>
                    <div className="busStop__tiles" {...longPress}>
                        <RearrangeModal
                            itemOrder={tileOrder}
                            onTileOrderChanged={(item) => {
                                setTileOrder(item)
                                saveToLocalStorage(
                                    boardId + '-tile-order',
                                    item,
                                )
                            }}
                            modalVisible={modalVisible}
                            onDismiss={() => setModalVisible(false)}
                        />
                        {tileOrder.map((item) => {
                            if (item.id == 'map') {
                                return hasData && mapCol ? (
                                    <div key={item.id}>
                                        <MapTile
                                            scooters={scooters}
                                            stopPlaces={
                                                stopPlacesWithDepartures
                                            }
                                            bikeRentalStations={
                                                bikeRentalStations
                                            }
                                            latitude={
                                                settings?.coordinates
                                                    ?.latitude ?? 0
                                            }
                                            longitude={
                                                settings?.coordinates
                                                    ?.longitude ?? 0
                                            }
                                            zoom={
                                                settings?.zoom ?? DEFAULT_ZOOM
                                            }
                                        />
                                    </div>
                                ) : (
                                    []
                                )
                            } else if (stopPlacesWithDepartures) {
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
                </LongPressProvider>
            </DashboardWrapper>
        )
    }
    return (
        <DashboardWrapper
            className="busStop"
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            scooters={scooters}
        >
            {!hasFetchedData ? (
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
                        {mapCol ? (
                            <div
                                key={totalItems - 1}
                                data-grid={getDataGrid(
                                    totalItems - 1,
                                    maxWidthCols,
                                )}
                            >
                                <MapTile
                                    scooters={scooters}
                                    stopPlaces={stopPlacesWithDepartures}
                                    bikeRentalStations={bikeRentalStations}
                                    latitude={
                                        settings?.coordinates?.latitude ?? 0
                                    }
                                    longitude={
                                        settings?.coordinates?.longitude ?? 0
                                    }
                                    zoom={settings?.zoom ?? DEFAULT_ZOOM}
                                />
                            </div>
                        ) : (
                            []
                        )}
                    </ResponsiveReactGridLayout>
                </div>
            )}
        </DashboardWrapper>
    )
}

export default BusStop
