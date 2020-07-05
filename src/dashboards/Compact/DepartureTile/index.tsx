import React from 'react'
import { LegMode } from '@entur/sdk'
import { colors } from '@entur/tokens'

import {
    getIcon,
    groupBy,
    unique,
    getTransportIconIdentifier,
    createTileSubLabel,
} from '../../../utils'
import { StopPlaceWithDepartures, LineData } from '../../../types'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

import './styles.scss'

function getTransportHeaderIcons(
    departures: LineData[],
    hiddenModes?: LegMode[],
): JSX.Element[] {
    const transportModes = unique(
        departures
            .map(({ type, subType }) => ({ type, subType }))
            .filter(({ type }) => !hiddenModes || !hiddenModes.includes(type)),
        (a, b) =>
            getTransportIconIdentifier(a.type, a.subType) ===
            getTransportIconIdentifier(b.type, b.subType),
    )

    const transportIcons = transportModes.map(({ type, subType }) => ({
        icon: getIcon(type, subType, colors.blues.blue60),
    }))

    return transportIcons.map(({ icon }) => icon)
}

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const groupedDepartures = groupBy<LineData>(departures, 'route')
    const headerIcons = getTransportHeaderIcons(departures)
    const routes = Object.keys(groupedDepartures)

    return (
        <Tile title={name} icons={headerIcons}>
            {routes.map((route) => {
                const subType = groupedDepartures[route][0].subType
                const routeData = groupedDepartures[route].slice(0, 3)
                const routeType = routeData[0].type
                const icon = getIcon(routeType, subType)

                return (
                    <TileRow
                        key={route}
                        label={route}
                        subLabels={routeData.map(createTileSubLabel)}
                        icon={icon}
                    />
                )
            })}
        </Tile>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
}

export default DepartureTile
