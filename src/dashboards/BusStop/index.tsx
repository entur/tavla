import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { useStopPlacesWithDepartures } from '../../logic'
import DepartureTile from './DepartureTile' 

import './styles.scss'
function getDataGrid(index: number): { [key: string]: number } {
    return {
        w: 4,
        maxW: 4,
        minH: 1,
        h: 4,
        x: index,
        y: 0,
    }
}

function BusStop({ history }: Props): JSX.Element {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    return (
        <DashboardWrapper
            className="busStop"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="busStop__tiles">
            { (stopPlacesWithDepartures || []).map(stopPlace => {
               return (
                (stopPlacesWithDepartures || []).map((stop, index) => (
                    <div
                        key={index.toString()}
                        data-grid={getDataGrid(index)}
                    >
                        <DepartureTile
                            key={index}
                            stopPlaceWithDepartures={stop}
                        />
                    </div>
                ))
               )
           }) }
           </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default BusStop