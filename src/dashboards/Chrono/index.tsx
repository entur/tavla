import React, { useEffect, useState, useRef } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import { useLongPress } from 'use-long-press/dist'
import { useRouteMatch } from 'react-router'

import { FormFactor } from '@entur/sdk/lib/mobility/types'

import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useMobility,
    useWalkInfo,
} from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'
import { DEFAULT_ZOOM } from '../../constants'

import RearrangeModal, { Item } from '../../components/RearrangeModal'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'
import './styles.scss'
import { useSettingsContext } from '../../settings'

import { isEqualUnsorted, usePrevious, isMobileWeb } from '../../utils'

import { WalkInfo } from '../../logic/useWalkInfo'
import { LongPressProvider } from '../../logic/longPressContext'

import DepartureTile from './DepartureTile'
import MapTile from './MapTile'

import BikeTile from './BikeTile'
import WeatherTile from './WeatherTile'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

const isMobile = isMobileWeb()

const TEMP_SETTINGS = { showWeather: true }

function getWalkInfoForStopPlace(
    walkInfos: WalkInfo[],
    id: string,
): WalkInfo | undefined {
    return walkInfos?.find((walkInfo) => walkInfo.stopId === id)
}

function getDataGrid(
    index: number,
    maxWidth: number,
    resizable: boolean = true,
    height: number = 4,
): { [key: string]: number | boolean } {
    const dataGrid = {
        w: 1,
        maxW: maxWidth,
        minH: 1,
        h: height,
        x: index % maxWidth,
        y: 0,
    }
    return resizable ? dataGrid : { ...dataGrid, isResizable: false }
}

function getDefaultBreakpoint() {
    if (window.innerWidth > BREAKPOINTS.lg) {
        return 'lg'
    } else if (window.innerWidth > BREAKPOINTS.md) {
        return 'md'
    }
    return 'sm'
}

const BREAKPOINTS = {
    lg: 1400,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
}

const COLS: { [key: string]: number } = {
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1,
    xxs: 1,
}

const ChronoDashboard = ({ history }: Props): JSX.Element | null => {
    const [settings] = useSettingsContext()
    const dashboardKey = history.location.key
    const [isLongPressStarted, setIsLongPressStarted] = useState<boolean>(false)
    const isCancelled = useRef<NodeJS.Timeout>()
    const boardId =
        useRouteMatch<{ documentId: string }>('/t/:documentId')?.params
            ?.documentId

    const [breakpoint, setBreakpoint] = useState<string>(getDefaultBreakpoint())
    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey),
    )

    const [tileOrder, setTileOrder] = useState<Item[] | undefined>(
        boardId ? getFromLocalStorage(boardId + '-tile-order') : undefined,
    )

    const bikeRentalStations = useBikeRentalStations()
    let stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const scooters = useMobility(FormFactor.SCOOTER)

    const hasData = Boolean(
        bikeRentalStations?.length ||
            scooters?.length ||
            stopPlacesWithDepartures?.length,
    )
    function clearLongPressTimeout() {
        setIsLongPressStarted(false)
        if (isCancelled.current) {
            clearTimeout(isCancelled.current)
        }
    }
    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }

    const walkInfo = useWalkInfo(stopPlacesWithDepartures)

    const numberOfStopPlaces = stopPlacesWithDepartures?.length || 0
    const anyBikeRentalStations: number | null =
        bikeRentalStations && bikeRentalStations.length

    const bikeCol = anyBikeRentalStations ? 1 : 0
    const mapCol = hasData ? 1 : 0
    const weatherCol = TEMP_SETTINGS.showWeather ? 1 : 0
    const totalItems = numberOfStopPlaces + bikeCol + mapCol + weatherCol

    const maxWidthCols = COLS[breakpoint]

    const prevNumberOfStopPlaces = usePrevious(numberOfStopPlaces)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        let defaultTileOrder: Item[] = []
        if (stopPlacesWithDepartures) {
            if (stopPlacesWithDepartures.length == prevNumberOfStopPlaces) {
                return
            }
            defaultTileOrder = stopPlacesWithDepartures.map((item) => ({
                id: item.id,
                name: item.name,
            }))
        }
        if (anyBikeRentalStations) {
            defaultTileOrder = [
                ...defaultTileOrder,
                { id: 'city-bike', name: 'Bysykkel' },
            ]
        }
        if (hasData && settings?.showMap) {
            defaultTileOrder = [
                ...defaultTileOrder,
                { id: 'map', name: 'Kart' },
            ]
        }
        const storedTileOrder: Item[] | undefined = getFromLocalStorage(
            boardId + '-tile-order',
        )
        if (TEMP_SETTINGS.showWeather) {
            // TODO find condition for when weather should be shown
            defaultTileOrder = [
                ...defaultTileOrder,
                { id: 'weather', name: 'Vær' },
            ]
        }

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
    }, [
        stopPlacesWithDepartures,
        prevNumberOfStopPlaces,
        anyBikeRentalStations,
        hasData,
        settings?.showMap,
        boardId,
    ])

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
        let numberOfTileRows = 10
        if (window.innerWidth < BREAKPOINTS.xs) {
            numberOfTileRows = 6
        } else if (window.innerWidth < BREAKPOINTS.sm) {
            numberOfTileRows = 8
        }
        if (!tileOrder) return null

        return (
            <DashboardWrapper
                className="chrono"
                history={history}
                bikeRentalStations={bikeRentalStations}
                stopPlacesWithDepartures={stopPlacesWithDepartures}
                scooters={scooters}
            >
                <LongPressProvider value={isLongPressStarted}>
                    <div className="chrono__tiles" {...longPress}>
                        <div className="tile-wrapper">
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
                                    return hasData && settings?.showMap ? (
                                        <div key={item.id}>
                                            <MapTile
                                                scooters={scooters}
                                                stopPlaces={
                                                    stopPlacesWithDepartures
                                                }
                                                bikeRentalStations={
                                                    bikeRentalStations
                                                }
                                                walkTimes={null}
                                                latitude={
                                                    settings?.coordinates
                                                        ?.latitude ?? 0
                                                }
                                                longitude={
                                                    settings?.coordinates
                                                        ?.longitude ?? 0
                                                }
                                                zoom={
                                                    settings?.zoom ??
                                                    DEFAULT_ZOOM
                                                }
                                            />
                                        </div>
                                    ) : (
                                        []
                                    )
                                } else if (item.id == 'city-bike') {
                                    return bikeRentalStations &&
                                        anyBikeRentalStations ? (
                                        <div key={item.id}>
                                            <BikeTile
                                                stations={bikeRentalStations}
                                            />
                                        </div>
                                    ) : (
                                        []
                                    )
                                } else if (item.id == 'weather') {
                                    return (
                                        <div key={'TODO:UnikKey'}>
                                            <WeatherTile />
                                        </div>
                                    )
                                } else if (stopPlacesWithDepartures) {
                                    const stopIndex =
                                        stopPlacesWithDepartures.findIndex(
                                            (p) => p.id == item.id,
                                        )
                                    return (
                                        <div key={item.id}>
                                            <DepartureTile
                                                key={item.id}
                                                stopPlaceWithDepartures={
                                                    stopPlacesWithDepartures[
                                                        stopIndex
                                                    ]
                                                }
                                                walkInfo={getWalkInfoForStopPlace(
                                                    walkInfo || [],
                                                    item.id,
                                                )}
                                                isMobile
                                                numberOfTileRows={
                                                    numberOfTileRows
                                                }
                                            />
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </LongPressProvider>
            </DashboardWrapper>
        )
    }

    return (
        <DashboardWrapper
            className="chrono"
            history={history}
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="chrono__tiles">
                <ResponsiveReactGridLayout
                    key={breakpoint}
                    breakpoints={BREAKPOINTS}
                    cols={COLS}
                    layouts={gridLayouts}
                    isResizable={!isMobile}
                    isDraggable={!isMobile}
                    onBreakpointChange={(newBreakpoint: string) => {
                        setBreakpoint(newBreakpoint)
                    }}
                    onLayoutChange={(
                        layout: Layout[],
                        layouts: Layouts,
                    ): void => {
                        if (numberOfStopPlaces > 0) {
                            setGridLayouts(layouts)
                            saveToLocalStorage(dashboardKey, layouts)
                        }
                    }}
                >
                    {(stopPlacesWithDepartures || []).map((stop, index) => (
                        <div
                            key={stop.id}
                            data-grid={getDataGrid(index, maxWidthCols)}
                        >
                            <DepartureTile
                                key={index}
                                stopPlaceWithDepartures={stop}
                                walkInfo={getWalkInfoForStopPlace(
                                    walkInfo || [],
                                    stop.id,
                                )}
                            />
                        </div>
                    ))}
                    {bikeRentalStations && anyBikeRentalStations ? (
                        <div
                            key={'bike_stations'}
                            data-grid={getDataGrid(
                                numberOfStopPlaces,
                                maxWidthCols,
                            )}
                        >
                            <BikeTile stations={bikeRentalStations} />
                        </div>
                    ) : (
                        []
                    )}
                    {hasData && settings?.showMap ? (
                        <div
                            id="chrono-map-tile"
                            key={'map'}
                            data-grid={getDataGrid(
                                totalItems - 2,
                                maxWidthCols,
                            )}
                        >
                            <MapTile
                                scooters={scooters}
                                stopPlaces={stopPlacesWithDepartures}
                                bikeRentalStations={bikeRentalStations}
                                walkTimes={null}
                                latitude={settings?.coordinates?.latitude ?? 0}
                                longitude={
                                    settings?.coordinates?.longitude ?? 0
                                }
                                zoom={settings?.zoom ?? DEFAULT_ZOOM}
                            />
                        </div>
                    ) : (
                        []
                    )}
                    {TEMP_SETTINGS.showWeather && (
                        <div
                            key={'weather'}
                            data-grid={getDataGrid(
                                totalItems - 1,
                                maxWidthCols,
                            )}
                        >
                            <WeatherTile />
                        </div>
                    )}
                </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default ChronoDashboard
