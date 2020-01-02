import React from 'react'

import { useBikeRentalStations, useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import DepartureTile from './DepartureTile'
import RGL, { WidthProvider, Responsive } from 'react-grid-layout';

import { getFromLocalStorage, saveToLocalStorage } from '../../settings/LocalStorage'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

import './styles.scss'

function onLayoutChange(layouts, key) {
    saveToLocalStorage(key, layouts)
}

const EnturDashboard = ({ history }: Props): JSX.Element => {
    const dashboardKey = history.location.key

    const bikeRentalStations = useBikeRentalStations()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const numberOfStopplaces = stopPlacesWithDepartures ? stopPlacesWithDepartures.length : 0
    const localStorageLayout = getFromLocalStorage(history.location.key)

    return (
       <DashboardWrapper
            className="enturdash"
            history={history}
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="enturdash__tiles">
             <ResponsiveReactGridLayout
                cols={{ lg: numberOfStopplaces }}
                layouts={localStorageLayout}
                compactType="horizontal"
                isResizable={true}
                onLayoutChange={(layout, layouts) =>  onLayoutChange(layouts, dashboardKey) }>
              {
                    (stopPlacesWithDepartures || [])
                       .filter(({ departures }) => departures.length > 0)
                       .map((stop, index) => (
                           <div  key={index.toString()} data-grid={{ w: 1, maxW: 1, minH: 1, h: 4, x: index, y: 0}}>
                                <DepartureTile
                                    key={index}
                                    stopPlaceWithDepartures={stop}
                                />
                            </div>
                        ))
                }
            </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default EnturDashboard
