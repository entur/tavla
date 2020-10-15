import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { useStopPlacesWithDepartures } from '../../logic'

import DepartureTile from './DepartureTile'

import './styles.scss'

function BusStop({ history }: Props): JSX.Element {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

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
                ))}
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default BusStop
