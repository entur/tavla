import React, { useState, useMemo } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'
import { useParams } from 'react-router-dom'
import { useStopPlaceIds } from 'hooks/use-stop-place-ids/useStopPlaceIds'
import { ResizeHandle } from 'assets/icons/ResizeHandle'
import { getFromLocalStorage, saveToLocalStorage } from 'settings/LocalStorage'
import { useSettings } from 'settings/SettingsProvider'
import { WeatherTile } from 'tiles/dashboard/WeatherTile'
import { ImageTile } from 'tiles/dashboard/ImageTile'
import { BikeTile } from 'tiles/dashboard/BikeTile'
import { MapTile } from 'tiles/dashboard/MapTile'
import { MobileAppQRTile } from 'tiles/dashboard/MobileAppQRTile'
import { QRTile } from 'tiles/dashboard/QRTile'
import { Loader } from 'components/Loader/Loader'
import { BREAKPOINTS } from 'utils/constants'
import { DashboardWrapper } from 'scenarios/DashboardWrapper'
import classes from './ResponsiveGridDashboard.module.scss'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

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

function ResponsiveGridDashboard({
    TileComponent,
}: {
    TileComponent: React.FC<{ stopPlaceId: string }>
}) {
    const [settings] = useSettings()
    const [breakpoint, setBreakpoint] = useState<string>(getDefaultBreakpoint())

    const { documentId } = useParams<{ documentId: string }>()

    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(documentId as string),
    )

    const { stopPlaceIds, loading } = useStopPlaceIds()

    const isLocked = useMemo(
        () => settings.owners.length > 0,
        [settings.owners],
    )

    const numberOfStopPlaces = stopPlaceIds.length

    const bikeCol = !settings.hiddenModes.includes('bysykkel') ? 1 : 0
    const mapCol = settings.showMap ? 1 : 0
    const weatherCol = settings.showWeather ? 1 : 0

    const maxWidthCols = COLS[breakpoint] || 1

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

    if (loading) {
        return <Loader />
    }

    return (
        <DashboardWrapper className={classes.GridDashboard}>
            <div className={classes.Tiles}>
                <ResponsiveReactGridLayout
                    key={breakpoint}
                    breakpoints={BREAKPOINTS}
                    cols={COLS}
                    layouts={gridLayouts}
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
                            saveToLocalStorage(documentId as string, layouts)
                        }
                    }}
                >
                    {settings.showWeather && (
                        <div
                            key="weather"
                            data-grid={getDataGrid(2, maxWidthCols, 2, 1)}
                        >
                            <WeatherTile />
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
                            <TileComponent stopPlaceId={stopPlaceId} />
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
                    {settings.showMap && (
                        <div
                            id="map-tile"
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
                                3,
                                3,
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
                                        imageTilesToDisplay.length +
                                        index,
                                    maxWidthCols,
                                    4,
                                    2,
                                )}
                            >
                                <QRTile title={qrTile.displayName} />
                            </div>
                        ))}
                </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

export { ResponsiveGridDashboard }
