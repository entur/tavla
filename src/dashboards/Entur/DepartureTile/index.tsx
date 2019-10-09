import React from 'react'

import {
    getIcon, getIconColor, groupBy, getTransportHeaderIcons,
} from '../../../utils'
import { StopPlaceWithDepartures } from '../../../types'

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures, name, id } = stopPlaceWithDepartures
    const groupedDepartures = groupBy(departures, 'route')
    const transportHeaderIcons = getTransportHeaderIcons(departures)
    const routes = Object.keys(groupedDepartures)

    return (
        <div className="tile-container" key={id}>
            <div className="stop-header">
                <p className="stop-header--name">{name}</p>
                <div className="stop-header--icons">
                    {
                        transportHeaderIcons.map((Icon, index) => {
                            return (
                                <div className="stop-header--icon" key={ index }>
                                    <Icon height={ 30 } width={ 30 } color="#9BA4D2" />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div>
                {
                    routes.map((route) => {
                        const subType = groupedDepartures[route][0].subType
                        const routeData = groupedDepartures[route].slice(0, 3)
                        const routeType = routeData[0].type
                        const Icon = getIcon(routeType)
                        const iconColor = getIconColor(routeType, subType)

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

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures,
}

export default DepartureTile
