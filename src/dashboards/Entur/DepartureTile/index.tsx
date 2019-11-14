import React from 'react'
import { LegMode } from '@entur/sdk'
import { colors } from '@entur/tokens'

import {
    getIcon, getIconColor, groupBy, unique,
} from '../../../utils'
import { StopPlaceWithDepartures, LineData } from '../../../types'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

import './styles.scss'

function getTransportHeaderIcons(departures: Array<LineData>, hiddenModes?: Array<LegMode>): Array<JSX.Element> {
    const transportModes = unique(departures
        .map(({ type, subType }) => ({ type, subType }))
        .filter(({ type }) => !hiddenModes || !hiddenModes.includes(type)),
    ((a, b) => a.type === b.type && a.subType === b.subType))

    const transportIcons = transportModes
        .map(({ type, subType }) => ({ key: type + subType, Icon: getIcon(type, subType) }))
        .filter(({ Icon }, index, icons) => {
            // @ts-ignore
            const iconIndex = icons.findIndex(icon => icon.Icon.name === Icon.name)
            return iconIndex === index
        })

    return transportIcons.map(({ key, Icon }) => (
        <Icon key={ key } height={ 30 } width={ 30 } color={ colors.brand.lavender } />
    ))
}

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const groupedDepartures = groupBy<LineData>(departures, 'route')
    const headerIcons = getTransportHeaderIcons(departures)
    const routes = Object.keys(groupedDepartures)

    return (
        <Tile title={name} icons={headerIcons}>
            {
                routes.map((route) => {
                    const subType = groupedDepartures[route][0].subType
                    const routeData = groupedDepartures[route].slice(0, 3)
                    const routeType = routeData[0].type
                    const Icon = getIcon(routeType, subType)
                    const iconColor = getIconColor(routeType, subType)

                    return (
                        <TileRow
                            key={route}
                            label={route}
                            subLabels={routeData.map(data => data.time)}
                            icon={Icon ? <Icon height={ 24 } width={ 24 } color={ iconColor } className="route-icon" /> : null}
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
