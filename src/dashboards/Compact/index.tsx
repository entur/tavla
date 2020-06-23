import React from 'react'
import { WidthProvider, Responsive } from 'react-grid-layout'

import { useBikeRentalStations, useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import DepartureTile from './DepartureTile'
import BikeTile from './BikeTile'
import './styles.scss'

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

function onLayoutChange(layouts, key): void {
    saveToLocalStorage(key, layouts)
}

function getDataGrid(index): object {
    return {
        w: 1,
        maxW: 1,
        minH: 1,
        h: 4,
        x: index,
        y: 0,
    }
}

const EnturDashboard = ({ history }: Props): JSX.Element => {
    const dashboardKey = history.location.key

    const bikeRentalStations = useBikeRentalStations()

    let stopPlacesWithDepartures = useStopPlacesWithDepartures()

    // Remove stop places without departures
    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }

    const numberOfStopPlaces = stopPlacesWithDepartures
        ? stopPlacesWithDepartures.length
        : 0
    const anyBikeRentalStations =
        bikeRentalStations && bikeRentalStations.length

    const localStorageLayout = getFromLocalStorage(history.location.key)
    const extraCols = anyBikeRentalStations ? 1 : 0

    // Limit column count if there are not enough space
    function limitToMax(columns: number): number {
        return Math.min(numberOfStopPlaces + extraCols, columns)
    }

    const cols = {
        xxlg: limitToMax(6),
        xlg: limitToMax(5),
        lg: limitToMax(4),
        md: limitToMax(3),
        sm: limitToMax(2),
        xs: 1,
        xxs: 1,
    }

    const gridBreakpoints = {
        xxlg: 2200,
        xlg: 1600,
        lg: 1350,
        md: 996,
        sm: 768,
        xs: 480,
        xxs: 0,
    }

    return (
        <DashboardWrapper
            className="compact"
            history={history}
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="compact__tiles">
                <ResponsiveReactGridLayout
                    key={numberOfStopPlaces}
                    cols={cols}
                    layouts={localStorageLayout}
                    breakpoints={gridBreakpoints}
                    compactType="horizontal"
                    isResizable={true}
                    onLayoutChange={(layout, layouts) => {
                        if (numberOfStopPlaces > 0) {
                            onLayoutChange(layouts, dashboardKey)
                        }
                    }}
                >
                    {(stopPlacesWithDepartures || []).map((stop, index) => (
                        <div
                            key={index.toString()}
                            data-grid={getDataGrid(index)}
                        >
                            <DepartureTile
                                key={index}
                                stopPlaceWithDepartures={stop}
                            />
                        </div>
                    ))}
                    {anyBikeRentalStations ? (
                        <div
                            key={numberOfStopPlaces.toString()}
                            data-grid={getDataGrid(numberOfStopPlaces)}
                        >
                            <BikeTile stations={bikeRentalStations} />
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
