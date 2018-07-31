import React from 'react'
import { groupBy } from '../../utils'
import './styles.scss'
import DepartureTile from './departureTile'

const DepartureTiles = ({ lineData, visible }) => {
    const { hiddenStops, hiddenRoutes } = visible
    return (
        lineData
            .filter(({ departures }) => departures.length > 0)
            .filter(({ id }) => !hiddenStops.includes(id))
            .map((stop, index) => {
                const groupedDepartures = groupBy(stop.departures, 'route')
                const routes = Object.keys(groupedDepartures)
                return (
                    <DepartureTile
                        key={index}
                        stopPlace={stop}
                        routes={routes}
                        hiddenRoutes={hiddenRoutes}
                    />
                )
            })
    )
}

export default DepartureTiles
