import React, { useEffect, useState, useRef } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import { useLongPress } from 'use-long-press'
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

import WeatherTile from '../../components/Weather/WeatherTile'

import DepartureTile from './DepartureTile'
import MapTile from './MapTile'
import BikeTile from './BikeTile'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

const isMobile = isMobileWeb()

function getWalkInfoForStopPlace(
    walkInfos: WalkInfo[],
    id: string,
): WalkInfo | undefined {
    return walkInfos?.find((walkInfo) => walkInfo.stopId === id)
}

function getDataGrid(
    index: number,
    maxWidth: number,
    resizable = true,
    height = 4,
): { [key: string]: number | boolean | [] } {
    const dataGrid = {
        w: 1,
        maxW: maxWidth,
        minH: 1,
        h: height,
        x: index % maxWidth,
        y: 0,
    }
    return resizable
        ? dataGrid
        : { ...dataGrid, isResizable: false, resizeHandles: [] }
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
    const boardId =
        useRouteMatch<{ documentId: string }>('/t/:documentId')?.params
            ?.documentId

    const [isLongPressStarted, setIsLongPressStarted] = useState<boolean>(false)
    const isCancelled = useRef<NodeJS.Timeout>()

    const [breakpoint, setBreakpoint] = useState<string>(getDefaultBreakpoint())
    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey),
    )
    const [tileOrder, setTileOrder] = useState<Item[] | undefined>(
        boardId ? getFromLocalStorage(boardId + '-tile-order') : undefined,
    )

    const bikeRentalStations = useBikeRentalStations()
    const scooters = useMobility(FormFactor.SCOOTER)

    let stopPlacesWithDepartures = useStopPlacesWithDepartures()

    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }

    const walkInfo = useWalkInfo(stopPlacesWithDepartures)

    const numberOfStopPlaces = stopPlacesWithDepartures?.length || 0
    const anyBikeRentalStations: number | null =
        bikeRentalStations && bikeRentalStations.length

    const maxWidthCols = COLS[breakpoint]

    const prevNumberOfStopPlaces = usePrevious(numberOfStopPlaces)
    const [modalVisible, setModalVisible] = useState(false)

    const hasData = Boolean(
        bikeRentalStations?.length ||
            scooters?.length ||
            stopPlacesWithDepartures?.length,
    )

    const bikeCol = anyBikeRentalStations ? 1 : 0
    const mapCol = settings?.showMap ? 1 : 0
    const weatherCol = settings?.showWeather ? 1 : 0

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
        if (hasData && mapCol) {
            defaultTileOrder = [
                ...defaultTileOrder,
                { id: 'map', name: 'Kart' },
            ]
        }
        if (settings?.showWeather) {
            defaultTileOrder = [
                { id: 'weather', name: 'Vær' },
                ...defaultTileOrder,
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
    }, [
        stopPlacesWithDepartures,
        prevNumberOfStopPlaces,
        anyBikeRentalStations,
        mapCol,
        hasData,
        settings?.showMap,
        settings?.showWeather,
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

    function clearLongPressTimeout() {
        setIsLongPressStarted(false)
        if (isCancelled.current) {
            clearTimeout(isCancelled.current)
        }
    }

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
                                    return settings?.showWeather ? (
                                        <div key={item.id}>
                                            <WeatherTile
                                                className="tile"
                                                displayTemperature={
                                                    window.innerWidth > 290
                                                }
                                                displayPrecipitation={
                                                    window.innerWidth > 380
                                                }
                                                displayWind={
                                                    window.innerWidth > 570
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
                    {settings?.showWeather && (
                        <div
                            key="weather"
                            data-grid={getDataGrid(0, maxWidthCols, false, 1)}
                        >
                            <WeatherTile
                                className="tile"
                                displayTemperature={window.innerWidth > 290}
                                displayPrecipitation={window.innerWidth > 380}
                                displayWind={window.innerWidth > 570}
                            />
                        </div>
                    )}
                    {(stopPlacesWithDepartures || []).map((stop, index) => (
                        <div
                            key={stop.id}
                            data-grid={getDataGrid(
                                weatherCol + index,
                                maxWidthCols,
                            )}
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
                            key="city-bike"
                            data-grid={getDataGrid(
                                numberOfStopPlaces + weatherCol,
                                maxWidthCols,
                            )}
                        >
                            <BikeTile stations={bikeRentalStations} />
                        </div>
                    ) : (
                        []
                    )}
                    {hasData && mapCol ? (
                        <div
                            id="chrono-map-tile"
                            key="map"
                            data-grid={getDataGrid(
                                numberOfStopPlaces + bikeCol + weatherCol,
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
                </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default ChronoDashboard
