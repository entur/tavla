import React from 'react'
import { getIcon, groupBy, isVisible } from '../../utils'

const DepartureTile = ({ stopPlace, routes, hiddenRoutes }) => {
    const { departures, name, id } = stopPlace
    const groupedDepartures = groupBy(departures, 'route')

    if (isVisible(groupedDepartures, hiddenRoutes)) {
        return (
            <div className="tile-container" key={id}>
                <div className="stop-header">
                    { getIcon('bus', { height: 50 }) }
                    <h2>{name}</h2>
                </div>
                <div>
                    {
                        routes
                            .filter((route) => !hiddenRoutes.includes(route))
                            .map((route) => {
                                const routeData = groupedDepartures[route]
                                const routeType = routeData[0].type
                                return (
                                    <div key={route}>
                                        <div className="route-name">
                                            <div className="route-icon">{getIcon(routeType, { height: '11' })}</div>
                                            <p className="route-name-text">{route}</p>
                                        </div>
                                        <div className="route-departures">
                                            { routeData.map((data, index) => {
                                                return (
                                                    <div className="route-departure-time"key={index}>
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
        ) }
    return null
}

export default DepartureTile
