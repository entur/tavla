import React, { useState } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import DashboardWrapper from '../../containers/DashboardWrapper'

import { DEFAULT_ZOOM } from '../../constants'
import {
    useStopPlacesWithDepartures,
    useScooters,
    useBikeRentalStations,
} from '../../logic'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'
import { useSettingsContext } from '../../settings'

import DepartureTile from './DepartureTile'

import MapTile from './MapTile'

import './styles.scss'
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
const COLS: { [key: string]: number } = {
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1,
    xxs: 1,
}
function BusStop({ history }: Props): JSX.Element {
    //const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const [settings] = useSettingsContext()
    const dashboardKey = history.location.key
    const [breakpoint, setBreakpoint] = useState<string>('lg')
    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey),
    )

    let stopPlacesWithDepartures = useStopPlacesWithDepartures()

    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }
    const bikeRentalStations = useBikeRentalStations()
    const scooters = useScooters()
    const numberOfStopPlaces = stopPlacesWithDepartures?.length || 0
    const maxWidthCols = COLS[breakpoint]
    // Prøve å lage en grid med to kolonner, en med map og en for busstopp.
    return (
        <DashboardWrapper
            className="busStop"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="busStop__tiles">
                {(stopPlacesWithDepartures || []).map((stop, index) => (
                    <DepartureTile
                        key={index.toString()}
                        stopPlaceWithDepartures={stop}
                    />
                ))}{' '}
                <div>
                    {settings?.showMap ? (
                        <div
                            id="compact-map-tile"
                            key={numberOfStopPlaces - 1}
                            data-grid={getDataGrid(2, 2)}
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
                </div>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default BusStop
