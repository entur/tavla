import React, { useState, useEffect } from 'react'
import { colors } from '@entur/tokens'

import {
    getIcon,
    groupBy,
    unique,
    getTransportIconIdentifier,
    createTileSubLabel,
    getIconColorType,
    isNotNullOrUndefined,
} from '../../../utils'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

import './styles.scss'
import { useSettingsContext } from '../../../settings'

function getTransportHeaderIcons(departures: LineData[]): JSX.Element[] {
    const transportModes = unique(
        departures.map(({ type, subType }) => ({ type, subType })),
        (a, b) =>
            getTransportIconIdentifier(a.type, a.subType) ===
            getTransportIconIdentifier(b.type, b.subType),
    )

    return transportModes
        .map(({ type, subType }) =>
            getIcon(type, undefined, subType, colors.blues.blue60),
        )
        .filter(isNotNullOrUndefined)
}

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const groupedDepartures = groupBy<LineData>(departures, 'route')
    const headerIcons = getTransportHeaderIcons(departures)
    const routes = Object.keys(groupedDepartures)
    const [settings] = useSettingsContext()
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        'contrast',
    )

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

    return (
        <Tile title={name} icons={headerIcons}>
            {routes.map((route) => {
                const subType = groupedDepartures[route][0].subType
                const routeData = groupedDepartures[route].slice(0, 3)
                const routeType = routeData[0].type
                const icon = getIcon(routeType, iconColorType, subType)

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
