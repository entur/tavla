import React from 'react'
import { getIcon, groupBy, isVisible } from '../../utils'
import './departureTable.css'

const DepartureTables = ({ lineData, visible }) => {
    const { hiddenStops, hiddenRoutes, hiddenModes } = visible
    return (
        lineData
            .filter(({ departures }) => departures.length > 0)
            .filter(({ id }) => !hiddenStops.includes(id))
            .map(({
                departures, name, id,
            }) => {
                const groupedDepartures = groupBy(departures, 'route')
                const routes = Object.keys(groupedDepartures)
                if (isVisible(groupedDepartures, hiddenRoutes, hiddenModes)) {
                    return (
                        <div className="table-container" key={id}>
                            <div className="table-header">
                                <h2>{name}</h2>
                            </div>
                            <div>
                                {
                                    routes
                                        .filter((route) => !hiddenRoutes.includes(route))
                                        .map(route => {
                                            const routeData = groupedDepartures[route]
                                            const routeType = routeData[0].type
                                            return (
                                                <div key={route}>
                                                    <div className="table-route-name">
                                                        <div className="route-icon">{ getIcon(routeType, { height: 25, width: 25 })}</div>
                                                        <p className="route-name-text">{route}</p>
                                                    </div>
                                                    <div className="table-route-departures">
                                                        { routeData.map((data, index) => {
                                                            return (
                                                                <div className="table-route-departure-time" key={index}>
                                                                    {data.time}
                                                                </div>)
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })
                                }
                            </div>
                        </div>
                    )
                }
            })
    )
}

export default DepartureTables
