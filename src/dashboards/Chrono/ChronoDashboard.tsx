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
import { useSettings } from '../../settings/SettingsProvider'
import { isMobileWeb } from '../../utils/utils'
import { WeatherTile } from '../../components/WeatherTile/WeatherTile'
import { ImageTile } from '../../components/ImageTile/ImageTile'
import { BikeTile } from '../../components/BikeTile/BikeTile'
import { MapTile } from '../../components/MapTile/MapTile'
import { QRTile } from '../../components/QRTile/QRTile'
import { MobileAppQRTile } from '../../components/MobileAppQRTile/MobileAppQRTile'
import { useStopPlaceIds } from '../../logic/use-stop-place-ids/useStopPlaceIds'
import { ChronoDepartureTile } from './ChronoDepartureTile/ChronoDepartureTile'
import classes from './ChronoDashboard.module.scss'

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

    const { stopPlaceIds } = useStopPlaceIds()

    const isLocked = useMemo(
        () => settings.owners.length > 0,
        [settings.owners],
    )

    const numberOfCustomImages = settings.customImageTiles.filter(
        ({ id }) => !settings.hiddenCustomTileIds.includes(id),
    ).length

    const numberOfStopPlaces = stopPlaceIds.length

    const maxWidthCols = COLS[breakpoint] || 1

    const bikeCol = !settings.hiddenModes.includes('bysykkel') ? 1 : 0
    const mapCol = settings.showMap ? 1 : 0
    const weatherCol = settings.showWeather ? 1 : 0

    const imageTilesToDisplay = useMemo(
        () =>
            settings.showCustomTiles && isLocked
                ? settings.customImageTiles.filter(
                      ({ id }) => !settings.hiddenCustomTileIds.includes(id),
                  )
                : [],
        [
            settings.customImageTiles,
            settings.showCustomTiles,
            settings.hiddenCustomTileIds,
            isLocked,
        ],
    )

    const qrTilesToDisplay = useMemo(
        () =>
            settings.showCustomTiles && isLocked
                ? settings.customQrTiles.filter(
                      ({ id }) => !settings.hiddenCustomTileIds.includes(id),
                  )
                : [],
        [
            settings.showCustomTiles,
            settings.customQrTiles,
            settings.hiddenCustomTileIds,
            isLocked,
        ],
    )

    return (
        <DashboardWrapper className={classes.Chrono}>
            <div className={classes.Tiles}>
                <ResponsiveReactGridLayout
                    key={breakpoint}
                    breakpoints={BREAKPOINTS}
                    cols={COLS}
                    layouts={gridLayouts}
                    isResizable={!isMobile}
                    isDraggable={!isMobile}
                    draggableCancel={`.${classes.ResizeHandle}`}
                    resizeHandle={
                        <span>
                            <ResizeHandle
                                size="32"
                                variant="light"
                                className={classes.ResizeHandle}
                            />
                        </span>
                    }
                    containerPadding={[0, 0]}
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
                    {settings.showWeather && (
                        <div
                            key="weather"
                            data-grid={getDataGrid(0, maxWidthCols, 2, 1)}
                        >
                            <WeatherTile className="tile" />
                        </div>
                    )}
                    {stopPlaceIds.map((stopPlaceId, index) => (
                        <div
                            key={stopPlaceId}
                            data-grid={getDataGrid(
                                weatherCol + index,
                                maxWidthCols,
                            )}
                        >
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
                            <MapTile />
                        </div>
                    )}
                    {settings.showMobileAppQrTile && (
                        <div
                            key="qr"
                            data-grid={getDataGrid(
                                numberOfStopPlaces + bikeCol + weatherCol + 1,
                                maxWidthCols,
                                2,
                                2,
                                Infinity,
                            )}
                        >
                            <MobileAppQRTile />
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
                                    4,
                                    2,
                                )}
                            >
                                <QRTile
                                    title={qrTile.displayName}
                                    sourceUrl={qrTile.sourceUrl}
                                    description={qrTile.description}
                                />
                            </div>
                        ))}
                </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

export { ChronoDashboard }
