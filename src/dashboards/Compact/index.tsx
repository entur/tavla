import React, { useState } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useScooters,
} from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'
import ResizeHandle from '../../assets/icons/ResizeHandle'

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'

import { useSettingsContext } from '../../settings'

import { DEFAULT_ZOOM } from '../../constants'

import DepartureTile from './DepartureTile'
import BikeTile from './BikeTile'
import MapTile from './MapTile'

import './styles.scss'
//import { MapController } from 'react-map-gl'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

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

const EnturDashboard = ({ history }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const [breakpoint, setBreakpoint] = useState<string>('lg')
    const dashboardKey = history.location.key
    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey),
    )

    const bikeRentalStations = useBikeRentalStations()

    const scooters = useScooters()

    let stopPlacesWithDepartures = useStopPlacesWithDepartures()

    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }

    const numberOfStopPlaces = stopPlacesWithDepartures
        ? stopPlacesWithDepartures.length
        : 0
    const anyBikeRentalStations: number | null =
        bikeRentalStations && bikeRentalStations.length

    //const anyScooters = Boolean(scooters && scooters.length)

    const bikeCol = anyBikeRentalStations ? 1 : 0

    //const scooterCol = anyScooters ? 1 : 0
    const mapCol =
        bikeRentalStations?.length ||
        scooters?.length ||
        stopPlacesWithDepartures?.length
            ? 1
            : 0

    const totalItems = numberOfStopPlaces + bikeCol + mapCol

    const cols: { [key: string]: number } = {
        lg: Math.min(totalItems, 4),
        md: Math.min(totalItems, 3),
        sm: 1,
        xs: 1,
        xxs: 1,
    }

    const maxWidthCols = cols[breakpoint]

    return (
        <DashboardWrapper
            className="compact"
            history={history}
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            scooters={scooters}
        >
            <div className="compact__tiles">
                <ResponsiveReactGridLayout
                    key={breakpoint}
                    cols={cols}
                    layouts={gridLayouts}
                    isResizable={true}
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
                            <ResizeHandle
                                size="32"
                                className="resizeHandle"
                                variant="light"
                            />
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
                            <ResizeHandle
                                size="32"
                                className="resizeHandle"
                                variant="light"
                            />
                            <BikeTile stations={bikeRentalStations} />
                        </div>
                    ) : (
                        []
                    )}
                    {scooters?.length ||
                    stopPlacesWithDepartures?.length ||
                    bikeRentalStations?.length ? (
                        <div
                            id="compact-map-tile"
                            key={totalItems - 1}
                            data-grid={getDataGrid(
                                totalItems - 1,
                                maxWidthCols,
                            )}
                        >
                            <ResizeHandle
                                size="32"
                                className="resizeHandle"
                                variant="dark"
                            />
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

export default EnturDashboard
