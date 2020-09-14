import React,  {useState,useEffect}  from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import { useBikeRentalStations, useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import BikeTile from './BikeTile'
import DepartureTile from './DepartureTile'

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

const ChronoDashboard = ({ history }: Props): JSX.Element => {
    const dashboardKey = history.location.key

    const bikeRentalStations = useBikeRentalStations()
    let stopPlacesWithDepartures = useStopPlacesWithDepartures()

    // Remove stop places without departures
    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }

    const numberOfStopPlaces = stopPlacesWithDepartures?.length || 0

    const anyBikeRentalStations =
        bikeRentalStations && bikeRentalStations.length

    const [layouts, setLayouts] = useState(getFromLocalStorage(history.location.key) || {})

    useEffect(() => {
    saveToLocalStorage(dashboardKey, layouts)
  }, [dashboardKey, layouts])

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
            className="chrono"
            history={history}
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="chrono__tiles">
                <ResponsiveReactGridLayout
                    key={numberOfStopPlaces}
                    cols={cols}
                    layouts={layouts}
                    compactType="horizontal"
                    isResizable={true}
                    onLayoutChange={(
                        layout: Layout[],
                        layouts: Layouts,
                    ): void => {
                        if (numberOfStopPlaces > 0) {
                            setLayouts(layouts)
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
                </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default ChronoDashboard
