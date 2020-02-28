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
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const numberOfStopPlaces = stopPlacesWithDepartures
        ? stopPlacesWithDepartures.length
        : 0
    const anyBikeRentalStations =
        bikeRentalStations && bikeRentalStations.length

    const localStorageLayout = getFromLocalStorage(history.location.key)
    const extraCols = anyBikeRentalStations ? 1 : 0

    const cols = {
        lg: numberOfStopPlaces + extraCols,
        md: numberOfStopPlaces + extraCols,
        sm: 1,
        xs: 1,
        xxs: 1,
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
                    compactType="horizontal"
                    isResizable={true}
                    onLayoutChange={(layout, layouts) => {
                        if (numberOfStopPlaces > 0) {
                            onLayoutChange(layouts, dashboardKey)
                        }
                    }}
                >
                    {(stopPlacesWithDepartures || [])
                        .filter(({ departures }) => departures.length > 0)
                        .map((stop, index) => (
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
