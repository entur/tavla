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

const DepartureTile = ({
    stopPlaceWithDepartures,
    walkTime,
}: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const groupedDepartures = groupBy<LineData>(departures, 'route')
    const headerIcons = getTransportHeaderIcons(departures)
    const routes = Object.keys(groupedDepartures)
    const [settings] = useSettingsContext()
    const hideSituations = settings?.hideSituations
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

    return (
        <Tile title={name} icons={headerIcons} walkTime={walkTime}>
            {routes.map((route) => {
                const subType = groupedDepartures[route][0].subType
                const routeData = groupedDepartures[route]
                const routeType = routeData[0].type
                const icon = getIcon(routeType, iconColorType, subType)
                const platform = routeData[0].quay?.publicCode
                return (
                    <TileRow
                        key={route}
                        label={route}
                        subLabels={routeData.map(createTileSubLabel)}
                        icon={icon}
                        hideSituations={hideSituations}
                        platform={platform}
                        type={routeType}
                    />
                )
            })}
        </Tile>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
    walkTime?: number
}

export default DepartureTile
