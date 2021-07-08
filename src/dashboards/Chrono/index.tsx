import React, { useState } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useScooters,
} from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'
import { DEFAULT_ZOOM } from '../../constants'

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'
import './styles.scss'
import { useSettingsContext } from '../../settings'

import MapTile from './MapTile'

import BikeTile from './BikeTile'
import DepartureTile from './DepartureTile'

const ResponsiveReactGridLayout = WidthProvider(Responsive)
function isMobileWeb(): boolean {
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    )
}
function getDataGrid(
    index: number,
    maxWidth: number,
): { [key: string]: number } {
    return {
        w: 1,
        maxW: maxWidth,
        minH: 1,
        h: 4,
        x: index % maxWidth,
        y: 0,
    }
}

const BREAKPOINTS = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
}

const COLS: { [key: string]: number } = {
    lg: 4,
    md: 3,
    sm: 1,
    xs: 1,
    xxs: 1,
}

const ChronoDashboard = ({ history }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const dashboardKey = history.location.key
    const [breakpoint, setBreakpoint] = useState<string>('lg')
    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey),
    )
    const bikeRentalStations = useBikeRentalStations()
    let stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const scooters = useScooters()

    const hasData = Boolean(
        bikeRentalStations?.length ||
            scooters?.length ||
            stopPlacesWithDepartures?.length,
    )

    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }
    const numberOfStopPlaces = stopPlacesWithDepartures?.length || 0
    const anyBikeRentalStations: number | null =
        bikeRentalStations && bikeRentalStations.length

    const bikeCol = anyBikeRentalStations ? 1 : 0
    const mapCol = hasData ? 1 : 0
    const totalItems = numberOfStopPlaces + bikeCol + mapCol

    const maxWidthCols = COLS[breakpoint]

    if (window.innerWidth < BREAKPOINTS.md) {
        let numberOfTileRows = 10
        if (window.innerWidth < BREAKPOINTS.xs) {
            numberOfTileRows = 6
        } else if (window.innerWidth < BREAKPOINTS.sm) {
            numberOfTileRows = 8
        }
        return (
            <DashboardWrapper
                className="chrono"
                history={history}
                bikeRentalStations={bikeRentalStations}
                stopPlacesWithDepartures={stopPlacesWithDepartures}
                scooters={scooters}
            >
                <div className="chrono__tiles">
                    {(stopPlacesWithDepartures || []).map((stop, index) => (
                        <div key={index.toString()}>
                            <DepartureTile
                                key={index}
                                stopPlaceWithDepartures={stop}
                                isMobile={true}
                                numberOfTileRows={numberOfTileRows}
                            />
                        </div>
                    ))}

                    {bikeRentalStations && anyBikeRentalStations ? (
                        <div key={numberOfStopPlaces.toString()}>
                            <BikeTile stations={bikeRentalStations} />
                        </div>
                    ) : (
                        []
                    )}

                    {hasData && settings?.showMap ? (
                        <div id="compact-map-tile" key={totalItems - 1}>
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
                </div>
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
                    isResizable={!isMobileWeb()}
                    isDraggable={!isMobileWeb()}
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
                            key={index.toString()}
                            data-grid={getDataGrid(index, maxWidthCols)}
                        >
                            <DepartureTile
                                key={index}
                                stopPlaceWithDepartures={stop}
                            />
                        </div>
                    ))}
                    {bikeRentalStations && anyBikeRentalStations ? (
                        <div
                            key={numberOfStopPlaces.toString()}
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
                            id="compact-map-tile"
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
