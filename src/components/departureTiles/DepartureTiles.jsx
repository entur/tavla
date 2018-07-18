import React from 'react'
import { getIcon, groupBy } from '../../utils'
import './departureTiles.css'

const DepartureTiles = ({ lineData }) => {
    return (
        lineData.filter(({ departures }) => departures.length > 0).map(({
            departures, name, id,
        }) => {
            const groupedDepartures = groupBy(departures, 'route')
            const routes = Object.keys(groupedDepartures)
            return (
                <div className="tile-container" key={id}>
                    <div className="stop-header">
                        { getIcon('bus', { height: 50 }) }
                        <h2>{name}</h2>
                    </div>
                    <div>
                        {
                            routes.map(route => {
                                const routeData = groupedDepartures[route]
                                const routeType = routeData[0].type
                                return (
                                    <div key={route}>
                                        <div className="route-name">
                                            <div className="route-icon">{ getIcon(routeType, { height: '11' })}</div>
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
            )
        })
    )
}

export default DepartureTiles
