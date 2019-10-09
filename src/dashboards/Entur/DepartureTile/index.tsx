import React from 'react'

import {
    getIcon, getIconColor, groupBy, getTransportHeaderIcons,
} from '../../../utils'
import { StopPlaceWithDepartures } from '../../../types'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

import './styles.scss'

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const groupedDepartures = groupBy(departures, 'route')
    const transportHeaderIcons = getTransportHeaderIcons(departures)
    const routes = Object.keys(groupedDepartures)

    const headerIcons = transportHeaderIcons.map((Icon, index) => {
        return (
            <Icon key={index} height={ 30 } width={ 30 } color="#9BA4D2" />
        )
    })

    return (
        <Tile title={name} icons={headerIcons}>
            {
                routes.map((route) => {
                    const subType = groupedDepartures[route][0].subType
                    const routeData = groupedDepartures[route].slice(0, 3)
                    const routeType = routeData[0].type
                    const Icon = getIcon(routeType)
                    const iconColor = getIconColor(routeType, subType)

                    return (
                        <TileRow
                            key={route}
                            label={route}
                            subLabels={routeData.map(data => data.time)}
                            icon={<Icon height={ 24 } width={ 24 } color={ iconColor } className="route-icon" />}
                        />
                    )
                })
            }
        </Tile>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures,
}

export default DepartureTile
