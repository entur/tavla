import React from 'react'
import {
    getIcon, groupBy, isVisible, getTransportHeaderIcon,
} from '../../utils'


const DepartureTile = ({ stopPlace, routes, hiddenRoutes }) => {
    const { departures, name, id } = stopPlace
    const groupedDepartures = groupBy(departures, 'route')

    if (!isVisible(groupedDepartures, hiddenRoutes)) {
        return null
    }
    return (
        <div className="tile-container" key={id}>
            <div className="stop-header">
                { getTransportHeaderIcon(stopPlace.departures, { height: 90, width: 90 }) }
                <h2>{name}</h2>
            </div>
            <div>
                {
                    routes
                        .filter((route) => !hiddenRoutes.includes(route))
                        .map((route) => {
                            const routeData = groupedDepartures[route].slice(0, 3)
                            const routeType = routeData[0].type
                            return (
                                <div key={route}>
                                    <div className="route-name">
                                        <div className="route-icon">{getIcon(routeType, { height: 25, width: 25 })}</div>
                                        <p className="route-name-text">{route}</p>
                                    </div>
                                    <div className="route-departures">
                                        { routeData.map((data, index) => {
                                            return (
                                                <div className="route-departure-time" key={index}>
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

export default DepartureTile
