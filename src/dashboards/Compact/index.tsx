import React from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useScooters,
} from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import DepartureTile from './DepartureTile'
import BikeTile from './BikeTile'
import ScooterTile from './ScooterTile'
import './styles.scss'

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

function onLayoutChange(layouts: Layouts, key: string): void {
    saveToLocalStorage(key, layouts)
}

function getDataGrid(index: number): { [key: string]: number } {
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

    const scooters = useScooters()

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
    const anyBikeRentalStations: number | null =
        bikeRentalStations && bikeRentalStations.length

    // Var en rød strek her som forsvant av seg selv. Kan potensielt ha brukket koden :/
    const anyScooters: boolean | null =
        scooters && Object.values(scooters).some((sctr) => sctr.length)

    const localStorageLayout: Layouts =
        getFromLocalStorage(history.location.key) || {}

    const bikeCol = anyBikeRentalStations ? 1 : 0

    const scooterCol = anyScooters ? 1 : 0

    const cols = {
        lg: numberOfStopPlaces + bikeCol + scooterCol,
        md: numberOfStopPlaces + bikeCol + scooterCol,
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
                    onLayoutChange={(
                        layout: Layout[],
                        layouts: Layouts,
                    ): void => {
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
                    {bikeRentalStations && anyBikeRentalStations ? (
                        <div
                            key={numberOfStopPlaces.toString()}
                            data-grid={getDataGrid(numberOfStopPlaces)}
                        >
                            <BikeTile stations={bikeRentalStations} />
                        </div>
                    ) : (
                        []
                    )}
                    {scooters ? (
                        <div
                            key={'sparkesykkel'}
                            data-grid={getDataGrid(
                                numberOfStopPlaces + scooterCol,
                            )}
                        >
                            <ScooterTile scooters={scooters} />
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
