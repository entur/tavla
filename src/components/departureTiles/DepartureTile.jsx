import React from 'react'
import {
    getIcon, getIconColor, groupBy, isVisible, getTransportHeaderIcons,
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

    const transportHeaderIcons = getTransportHeaderIcons(stopPlace.departures, hiddenModes)

    return (
        <div className="tile-container" key={id}>
            <div className="stop-header">
                <p className="stop-header--name">{name}</p>
                <div className="stop-header--icons">
                    {
                        transportHeaderIcons.map((Icon, index) => {
                            return (
                                <div className="stop-header--icon" key={ index }><Icon height={ 30 } width={ 30 } color={ color } /></div>
                            )
                        })
                    }
                </div>
            </div>
            <div>
                {
                    routes
                        .filter((route) => !hiddenRoutes.includes(route))
                        .map((route) => {
                            const routeData = groupedDepartures[route].slice(0, 3)
                            const routeType = routeData[0].type
                            const Icon = getIcon(routeType)
                            const iconColor = getIconColor(routeType)

                            if (hiddenModes.includes(routeType)) {
                                return null
                            }
                            return (
                                <div key={route} className="route-wrapper">
                                    <div className="route-name">
                                        <Icon height={ 24 } width={ 24 } color={ iconColor } className="route-icon" />
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
