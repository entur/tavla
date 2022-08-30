import React, { useEffect, useState, useRef, useMemo } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import { useHistory, useRouteMatch } from 'react-router'

import { useLongPress } from 'use-long-press'

import { FormFactor } from '@entur/sdk/lib/mobility/types'

import { Loader } from '@entur/loader'

import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useMobility,
    useWalkInfo,
} from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'
import { DEFAULT_ZOOM } from '../../constants'
import ResizeHandle from '../../assets/icons/ResizeHandle'

import RearrangeModal, { Item } from '../../components/RearrangeModal'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'
import QRTile from '../../components/QRTile'
import ImageTile from '../../components/ImageTile'

import { useSettingsContext } from '../../settings'

import {
    isEqualUnsorted,
    usePrevious,
    isMobileWeb,
    BREAKPOINTS,
} from '../../utils'

import { WalkInfo } from '../../logic/useWalkInfo'
import { LongPressProvider } from '../../logic/longPressContext'

import WeatherTile from '../../components/WeatherTile'

import DepartureTile from './DepartureTile'
import MapTile from './MapTile'
import BikeTile from './BikeTile'

import './styles.scss'

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
    maxHeigth = 0,
    height = 4,
): { [key: string]: number } {
    const dataGrid = {
        w: 1,
        maxW: maxWidth,
        minH: 1,
        h: height,
        x: index % maxWidth,
        y: 0,
    }
    return !maxHeigth ? dataGrid : { ...dataGrid, maxH: maxHeigth }
}

function getDefaultBreakpoint() {
    if (window.innerWidth > BREAKPOINTS.lg) {
        return 'lg'
    } else if (window.innerWidth > BREAKPOINTS.md) {
        return 'md'
    }
    return 'sm'
}

const COLS: { [key: string]: number } = {
    lg: 3,
    md: 2,
    sm: 2,
    xs: 1,
    xxs: 1,
}

const ChronoDashboard = (): JSX.Element | null => {
    const [settings] = useSettingsContext()
    const {
        customImageTiles = [],
        customQrTiles = [],
        hiddenCustomTileIds = [],
        showCustomTiles,
    } = settings || {}
    const history = useHistory()
    const dashboardKey = history.location.key
    const boardId = useRouteMatch<{ documentId: string }>('/t/:documentId')
        ?.params?.documentId

    const [isLongPressStarted, setIsLongPressStarted] = useState<boolean>(false)
    const isCancelled = useRef<NodeJS.Timeout>()

    const [breakpoint, setBreakpoint] = useState<string>(getDefaultBreakpoint())
    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey as string),
    )
    const [tileOrder, setTileOrder] = useState<Item[] | undefined>(
        boardId ? getFromLocalStorage(boardId + '-tile-order') : undefined,
    )

    const bikeRentalStations = useBikeRentalStations()
    const scooters = useMobility(FormFactor.SCOOTER)

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const numberOfCustomImages = customImageTiles.filter(
        ({ id }) => !hiddenCustomTileIds.includes(id),
    ).length

    const walkInfoDestinations = useMemo(() => {
        if (!stopPlacesWithDepartures) return []
        return stopPlacesWithDepartures.map((dep) => ({
            ...dep,
            place: dep.id,
        }))
    }, [stopPlacesWithDepartures])
    const walkInfo = useWalkInfo(walkInfoDestinations)

    const numberOfStopPlaces = stopPlacesWithDepartures?.length || 0
    const anyBikeRentalStations: number | undefined =
        bikeRentalStations && bikeRentalStations.length

    const maxWidthCols = COLS[breakpoint] || 1

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

    const imageTilesToDisplay = useMemo(
        () =>
            showCustomTiles
                ? customImageTiles.filter(
                      ({ id }) => !hiddenCustomTileIds.includes(id),
                  )
                : [],
        [customImageTiles, showCustomTiles, hiddenCustomTileIds],
    )

    const qrTilesToDisplay = useMemo(
        () =>
            showCustomTiles
                ? customQrTiles.filter(
                      ({ id }) => !hiddenCustomTileIds.includes(id),
                  )
                : [],
        [showCustomTiles, customQrTiles, hiddenCustomTileIds],
    )

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

        if (imageTilesToDisplay)
            defaultTileOrder = [
                ...defaultTileOrder,
                ...imageTilesToDisplay.map((imgTile) => ({
                    id: imgTile.id,
                    name: imgTile.displayName,
                })),
            ]
        if (qrTilesToDisplay)
            defaultTileOrder = [
                ...defaultTileOrder,
                ...qrTilesToDisplay.map((qrTile) => ({
                    id: qrTile.id,
                    name: qrTile.displayName,
                })),
            ]

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
        imageTilesToDisplay,
        qrTilesToDisplay,
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
                                            <WeatherTile className="tile" />
                                        </div>
                                    ) : (
                                        []
                                    )
                                }
                                if (imageTilesToDisplay.length > 0) {
                                    const tile = imageTilesToDisplay.find(
                                        (img) => img.id === item.id,
                                    )

                                    if (tile)
                                        return (
                                            <div key={item.id}>
                                                <ImageTile {...tile} />
                                            </div>
                                        )
                                }

                                if (qrTilesToDisplay.length > 0) {
                                    const tile = qrTilesToDisplay.find(
                                        (qr) => qr.id === item.id,
                                    )

                                    if (tile)
                                        return (
                                            <div key={item.id} className="tile">
                                                <QRTile {...tile} />
                                            </div>
                                        )
                                }
                                if (stopPlacesWithDepartures) {
                                    const stopIndex =
                                        stopPlacesWithDepartures.findIndex(
                                            (p) => p.id == item.id,
                                        )

                                    const stopPlace =
                                        stopPlacesWithDepartures[stopIndex]
                                    return stopPlace ? (
                                        <div key={item.id}>
                                            <DepartureTile
                                                key={item.id}
                                                stopPlaceWithDepartures={
                                                    stopPlace
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
                                    ) : null
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
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            {!hasFetchedData ? (
                <div className="compact__loading-screen">
                    <Loader>Laster inn</Loader>
                </div>
            ) : (
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
                                saveToLocalStorage(
                                    dashboardKey as string,
                                    layouts,
                                )
                            }
                        }}
                    >
                        {settings?.showWeather && (
                            <div
                                key="weather"
                                data-grid={getDataGrid(0, maxWidthCols, 2, 1)}
                            >
                                <ResizeHandle
                                    size="32"
                                    className="resizeHandle"
                                    variant="light"
                                />
                                <WeatherTile className="tile" />
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
                                <ResizeHandle
                                    size="32"
                                    className="resizeHandle"
                                    variant="light"
                                />
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
                                {!isMobile ? (
                                    <ResizeHandle
                                        size="32"
                                        className="resizeHandle"
                                        variant="light"
                                    />
                                ) : null}
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
                                {!isMobile ? (
                                    <ResizeHandle
                                        size="32"
                                        className="resizeHandle"
                                        variant="dark"
                                    />
                                ) : null}
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
                        {imageTilesToDisplay.length > 0 &&
                            imageTilesToDisplay.map((imageTile, index) => (
                                <div
                                    key={imageTile.id}
                                    data-grid={getDataGrid(
                                        numberOfStopPlaces +
                                            weatherCol +
                                            bikeCol +
                                            mapCol +
                                            index,
                                        maxWidthCols,
                                        10,
                                        2,
                                    )}
                                >
                                    {!isMobile ? (
                                        <ResizeHandle
                                            size="32"
                                            className="resizeHandle"
                                            variant="light"
                                        />
                                    ) : null}
                                    <ImageTile {...imageTile} />
                                </div>
                            ))}
                        {qrTilesToDisplay.length > 0 &&
                            qrTilesToDisplay.map((qrTile, index) => (
                                <div
                                    key={qrTile.id}
                                    data-grid={getDataGrid(
                                        numberOfStopPlaces +
                                            weatherCol +
                                            bikeCol +
                                            mapCol +
                                            numberOfCustomImages +
                                            index,
                                        maxWidthCols,
                                        10,
                                        3,
                                    )}
                                >
                                    <div className="tile">
                                        {!isMobile ? (
                                            <ResizeHandle
                                                size="32"
                                                className="resizeHandle"
                                                variant="light"
                                            />
                                        ) : null}
                                        <QRTile {...qrTile} />
                                    </div>
                                </div>
                            ))}
                    </ResponsiveReactGridLayout>
                </div>
            )}
        </DashboardWrapper>
    )
}

export default ChronoDashboard
