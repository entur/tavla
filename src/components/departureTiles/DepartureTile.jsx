import React from 'react'
import {
    getIcon, groupBy, isVisible, getTransportHeaderIcon,
} from '../../utils'

const DepartureTile = ({
    stopPlace, routes, hiddenRoutes, hiddenModes,
}) => {
    const { departures, name, id } = stopPlace
    const groupedDepartures = groupBy(departures, 'route')
    if (!isVisible(groupedDepartures, hiddenRoutes, hiddenModes)) {
        return null
    }
    const color = '#9BA4D2'

    return (
        <div className="tile-container" key={id}>
            <div className="stop-header">
                <p className="stop-header--name">{name}</p>
                <div className="stop-header--icons">{ getTransportHeaderIcon(stopPlace.departures, { height: 45, width: 45 }, color, hiddenModes)}</div>
            </div>
            <div>
                {
                    routes
                        .filter((route) => !hiddenRoutes.includes(route))
                        .map((route) => {
                            const routeData = groupedDepartures[route].slice(0, 3)
                            const routeType = routeData[0].type
                            if (hiddenModes.includes(routeType)) {
                                return null
                            }
                            return (
                                <div key={route} className="route-wrapper">
                                    <div className="route-name">
                                        <div className="route-icon">{getIcon(routeType, { height: 35, width: 35 })}</div>
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
