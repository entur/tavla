import React, { useState, useMemo } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'
import { useLocation } from 'react-router-dom'
import { Loader } from '@entur/loader'
import {
    useRentalStations,
    useStopPlacesWithDepartures,
    useMobility,
    useWalkInfo,
} from '../../logic'
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
import { WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import { WeatherTile } from '../../components/WeatherTile/WeatherTile'
import { ImageTile } from '../../components/ImageTile/ImageTile'
import { BikeTile } from '../../components/BikeTile/BikeTile'
import { FormFactor } from '../../../graphql-generated/mobility-v2'
import { MobileAppQRTile } from '../../components/QRTile/MobileAppQRTile'
import { ChronoDepartureTile } from './ChronoDepartureTile/ChronoDepartureTile'
import { MapTile } from './MapTile/MapTile'
import './ChronoDashboard.scss'

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

    const bikeRentalStations = useRentalStations(
        true,
        FormFactor.Bicycle,
        settings.hiddenModes.includes('bysykkel'),
    )
    const scooters = useMobility(FormFactor.Scooter)

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const numberOfCustomImages = settings.customImageTiles.filter(
        ({ id }) => !settings.hiddenCustomTileIds.includes(id),
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

    const hasData = Boolean(
        bikeRentalStations?.length ||
            scooters?.length ||
            stopPlacesWithDepartures?.length,
    )

    const bikeCol = anyBikeRentalStations ? 1 : 0
    const mapCol = settings.showMap ? 1 : 0
    const weatherCol = settings.showWeather ? 1 : 0

    const stopPlacesHasLoaded = Boolean(
        stopPlacesWithDepartures || settings.hiddenModes.includes('kollektiv'),
    )

    const bikeHasLoaded = Boolean(
        bikeRentalStations || settings.hiddenModes.includes('bysykkel'),
    )

    const scooterHasLoaded = Boolean(
        scooters || settings.hiddenModes.includes('sparkesykkel'),
    )

    const hasFetchedData = Boolean(
        stopPlacesHasLoaded && bikeHasLoaded && scooterHasLoaded,
    )

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
                                <ChronoDepartureTile
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
            )}
        </DashboardWrapper>
    )
}

export { ChronoDashboard }
