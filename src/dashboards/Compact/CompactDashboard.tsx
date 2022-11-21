import React, { useState, useMemo } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'
import { useLocation } from 'react-router-dom'
import { Loader } from '@entur/loader'
import { useRentalStations, useMobility } from '../../logic'
import { useAllStopPlaceIds } from '../../logic/use-all-stop-place-ids/useAllStopPlaceIds'
import { DashboardWrapper } from '../../containers/DashboardWrapper/DashboardWrapper'
import { ResizeHandle } from '../../assets/icons/ResizeHandle'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'
import { useSettings } from '../../settings/SettingsProvider'
import { BREAKPOINTS } from '../../constants'
import { isMobileWeb } from '../../utils/utils'
import { WeatherTile } from '../../components/WeatherTile/WeatherTile'
import { QRTile } from '../../components/QRTile/QRTile'
import { ImageTile } from '../../components/ImageTile/ImageTile'
import { BikeTile } from '../../components/BikeTile/BikeTile'
import { FormFactor } from '../../../graphql-generated/mobility-v2'
import { CompactDepartureTile } from './CompactDepartureTile/CompactDepartureTile'
import { MapTile } from './MapTile/MapTile'
import './CompactDashboard.scss'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

const isMobile = isMobileWeb()

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

const CompactDashboard = (): JSX.Element | null => {
    const [settings] = useSettings()
    const location = useLocation()
    const [breakpoint, setBreakpoint] = useState<string>(getDefaultBreakpoint())

    const dashboardKey = location.key

    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey as string),
    )

    const bikeRentalStations = useRentalStations(
        true,
        FormFactor.Bicycle,
        settings.hiddenModes.includes('bysykkel'),
    )
    const scooters = useMobility(FormFactor.Scooter)

    const { allStopPlaceIds } = useAllStopPlaceIds()

    const numberOfStopPlaces = allStopPlaceIds.length
    const anyBikeRentalStations: number | undefined =
        bikeRentalStations && bikeRentalStations.length

    const bikeCol = anyBikeRentalStations ? 1 : 0
    const mapCol = settings.showMap ? 1 : 0
    const weatherCol = settings.showWeather ? 1 : 0

    const hasData = Boolean(bikeRentalStations?.length || scooters?.length)

    const maxWidthCols = COLS[breakpoint] || 1

    const bikeHasLoaded = Boolean(
        bikeRentalStations || settings.hiddenModes.includes('bysykkel'),
    )

    const scooterHasLoaded = Boolean(
        scooters || settings.hiddenModes.includes('sparkesykkel'),
    )

    const hasFetchedData = Boolean(bikeHasLoaded && scooterHasLoaded)

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
        <DashboardWrapper
            className="compact"
            bikeRentalStations={bikeRentalStations}
            scooters={scooters}
        >
            {!hasFetchedData ? (
                <div className="compact__loading-screen">
                    <Loader>Laster inn</Loader>
                </div>
            ) : (
                <div className="compact__tiles">
                    <ResponsiveReactGridLayout
                        key={breakpoint}
                        breakpoints={BREAKPOINTS}
                        cols={COLS}
                        layouts={gridLayouts}
                        isResizable={!isMobile}
                        isDraggable={!isMobile}
                        margin={[32, 32]}
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
                                <CompactDepartureTile
                                    stopPlaceId={stopPlaceId}
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
                                id="compact-map-tile"
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
                                    bikeRentalStations={bikeRentalStations}
                                    latitude={settings.coordinates.latitude}
                                    longitude={settings.coordinates.longitude}
                                    zoom={settings.zoom}
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
                                            imageTilesToDisplay.length +
                                            index,
                                        maxWidthCols,
                                        10,
                                        3,
                                    )}
                                >
                                    {!isMobile ? (
                                        <ResizeHandle
                                            size="32"
                                            className="resizeHandle"
                                            variant="light"
                                        />
                                    ) : null}
                                    <div className="tile">
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

export { CompactDashboard }
