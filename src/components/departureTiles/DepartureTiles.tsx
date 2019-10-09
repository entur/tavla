import React from 'react'

import { groupBy } from '../../utils'
import { StopPlaceWithDepartures, Settings } from '../../types'

import DepartureTile from './DepartureTile'
import './styles.scss'

const DepartureTiles = ({ lineData, visible }: Props): JSX.Element => {
    const { hiddenStops, hiddenRoutes, hiddenModes } = visible
    return (
        <>
            {
                lineData
                    .filter(({ departures }) => departures.length > 0)
                    .filter(({ id }) => !hiddenStops.includes(id))
                    .sort((a, b) => a.name.localeCompare(b.name, 'no'))
                    .map((stop, index) => {
                        const groupedDepartures = groupBy(stop.departures, 'route')
                        const routes = Object.keys(groupedDepartures)
                        return (
                            <DepartureTile
                                key={index}
                                stopPlace={stop}
                                routes={routes}
                                hiddenRoutes={hiddenRoutes}
                                hiddenModes={hiddenModes}
                            />
                        )
                    })
            }
        </>
    )
}

interface Props {
    lineData: Array<StopPlaceWithDepartures>,
    visible: Settings,
}

export default DepartureTiles
