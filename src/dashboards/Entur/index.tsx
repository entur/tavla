import React from 'react'

import { useBikeRentalStations, useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import DepartureTile from './DepartureTile'
import RGL, { WidthProvider, Responsive } from 'react-grid-layout';

const ResponsiveReactGridLayout = WidthProvider(Responsive)

import './styles.scss'

function getFromLS(key) {
  let ls = {};
  if (window.localStorage) {
    try {
      ls = JSON.parse(window.localStorage.getItem("tavla-dashboard-laout")) || {};
    }
    catch(e){
      console.log(e)
    }
  }
  return ls[key];
}


function saveToLS(key, value) {
  if (window.localStorage) {
    window.localStorage.setItem(
      "tavla-dashboard-laout",
      JSON.stringify({
        [key]: value
      })
    );
  }
}

function onLayoutChange(layout, layouts) {
   saveToLS("layouts", layouts)
}

const EnturDashboard = ({ history }: Props): JSX.Element => {
    const bikeRentalStations = useBikeRentalStations()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const numberOfStopplaces = stopPlacesWithDepartures ? stopPlacesWithDepartures.length : 0
    const lay = getFromLS("layouts")
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
                layouts={lay}
                compactType="horizontal"
                isResizable={true}
                margin={[10,20]}
                onLayoutChange={(layout, layouts) =>  onLayoutChange(layout, layouts) }>
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
