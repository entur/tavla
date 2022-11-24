import React, { useState, useMemo } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'
import { useLocation } from 'react-router-dom'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { BREAKPOINTS } from '../../constants'
import { ResizeHandle } from '../../assets/icons/ResizeHandle'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'
import { QRBox } from '../../components/QRTile/QRBox'
import { useSettings } from '../../settings/SettingsProvider'
import { isMobileWeb } from '../../utils/utils'
import { WeatherTile } from '../../components/WeatherTile/WeatherTile'
import { ImageTile } from '../../components/ImageTile/ImageTile'
import { BikeTile } from '../../components/BikeTile/BikeTile'
import { MapTile } from '../../components/MapTile/MapTile'
import { MobileAppQRTile } from '../../components/QRTile/MobileAppQRTile'
import { useAllStopPlaceIds } from '../../logic/use-all-stop-place-ids/useAllStopPlaceIds'
import { ChronoDepartureTile } from './ChronoDepartureTile/ChronoDepartureTile'
import './ChronoDashboard.scss'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

const isMobile = isMobileWeb()

function getDataGrid(
    index: number,
    maxWidth: number,
    maxHeigth = 0,
    height = 4,
    y = 0,
): { [key: string]: number } {
    const dataGrid = {
        w: 1,
        maxW: maxWidth,
        minH: 1,
        h: height,
        x: index % maxWidth,
        y,
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
    const [settings] = useSettings()
    const location = useLocation()
    const dashboardKey = location.key

    const [breakpoint, setBreakpoint] = useState<string>(getDefaultBreakpoint())
    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey as string),
    )

    const { allStopPlaceIds } = useAllStopPlaceIds()

    const numberOfCustomImages = settings.customImageTiles.filter(
        ({ id }) => !settings.hiddenCustomTileIds.includes(id),
    ).length

    const numberOfStopPlaces = allStopPlaceIds.length

    const maxWidthCols = COLS[breakpoint] || 1

    const bikeCol = !settings.hiddenModes.includes('bysykkel') ? 1 : 0
    const mapCol = settings.showMap ? 1 : 0
    const weatherCol = settings.showWeather ? 1 : 0

    const imageTilesToDisplay = useMemo(
        () =>
            settings.showCustomTiles
                ? settings.customImageTiles.filter(
                      ({ id }) => !settings.hiddenCustomTileIds.includes(id),
                  )
                : [],
        [
            settings.customImageTiles,
            settings.showCustomTiles,
            settings.hiddenCustomTileIds,
        ],
    )

    const qrTilesToDisplay = useMemo(
        () =>
            settings.showCustomTiles
                ? settings.customQrTiles.filter(
                      ({ id }) => !settings.hiddenCustomTileIds.includes(id),
                  )
                : [],
        [
            settings.showCustomTiles,
            settings.customQrTiles,
            settings.hiddenCustomTileIds,
        ],
    )

    return (
        <DashboardWrapper className="chrono">
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
                            saveToLocalStorage(dashboardKey as string, layouts)
                        }
                    }}
                >
                    {settings.showMobileAppQrTile && (
                        <div
                            key="qr"
                            data-grid={getDataGrid(
                                maxWidthCols - 1,
                                maxWidthCols,
                                1.8,
                                1.8,
                                Infinity,
                            )}
                        >
                            <MobileAppQRTile />
                        </div>
                    )}

                    {settings.showWeather && (
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
                    {allStopPlaceIds.map((stopPlaceId, index) => (
                        <div
                            key={stopPlaceId}
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
                            <ChronoDepartureTile stopPlaceId={stopPlaceId} />
                        </div>
                    ))}
                    {!settings.hiddenModes.includes('bysykkel') && (
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
                            <BikeTile />
                        </div>
                    )}
                    {mapCol && (
                        <div
                            id="chrono-map-tile"
                            key="map"
                            data-grid={getDataGrid(
                                numberOfStopPlaces + bikeCol + weatherCol,
                                maxWidthCols,
                            )}
                        >
                            {!isMobile && (
                                <ResizeHandle
                                    size="32"
                                    className="resizeHandle"
                                    variant="dark"
                                />
                            )}
                            <MapTile />
                        </div>
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
                                    <QRBox {...qrTile} />
                                </div>
                            </div>
                        ))}
                </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

export { ChronoDashboard }
