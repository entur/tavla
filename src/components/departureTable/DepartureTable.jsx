import React from 'react'
import { getIcon, groupBy } from '../../utils'
import './departureTable.css'

const DepartureTable = ({ lineData, visible }) => {
    return (
        lineData
            .filter(({ departures }) => departures.length > 0)
            .filter(({ id }) => !visible.includes(id))
            .map(({
                departures, name, id,
            }) => {
                const groupedDepartures = groupBy(departures, 'route')
                const routes = Object.keys(groupedDepartures)
                return (
                    <div className="table-container" key={id}>
                        <div className="table-header">
                            <h2>{name}</h2>
                        </div>
                        <div>
                            {
                                routes.map(route => {
                                    const routeData = groupedDepartures[route]
                                    const routeType = routeData[0].type
                                    return (
                                        <div key={route}>
                                            <div className="table-route-name">
                                                <div className="route-icon">{ getIcon(routeType, { height: '0.8' })}</div>
                                                <p className="route-name-text">{route}</p>
                                            </div>
                                            <div className="table-route-departures">
                                                { routeData.map((data, index) => {
                                                    return (
                                                        <div className="table-route-departure-time"key={index}>
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

export default DepartureTable
