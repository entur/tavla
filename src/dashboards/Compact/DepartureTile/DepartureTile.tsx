import React, { useState, useEffect } from 'react'
import {
    getIcon,
    groupBy,
    unique,
    getTransportIconIdentifier,
    createTileSubLabel,
    getIconColorType,
    isNotNullOrUndefined,
    filterMap,
} from '../../../utils'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'
import { Tile } from '../components/Tile/Tile'
import { TileRow } from '../components/TileRow/TileRow'
import { useSettingsContext } from '../../../settings'
import { WalkInfo } from '../../../logic/useWalkInfo'
import './DepartureTile.scss'

function getTransportHeaderIcons(
    departures: LineData[],
    iconColorType: IconColorType,
): JSX.Element[] {
    const transportModes = unique(
        departures.map(({ type, subType }) => ({ type, subType })),
        (a, b) =>
            getTransportIconIdentifier(a.type, a.subType) ===
            getTransportIconIdentifier(b.type, b.subType),
    )

    return transportModes
        .map(({ type, subType }) => getIcon(type, iconColorType, subType))
        .filter(isNotNullOrUndefined)
}

const DepartureTile = ({
    stopPlaceWithDepartures,
    walkInfo,
}: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const groupedDepartures = groupBy<LineData>(departures, 'route')
    const routes = Object.keys(groupedDepartures)
    const [settings] = useSettingsContext()
    const hideSituations = settings?.hideSituations
    const hideTracks = settings?.hideTracks
    const hideWalkInfo = settings?.hideWalkInfo
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

    return (
        <Tile
            title={name}
            icons={getTransportHeaderIcons(departures, iconColorType)}
            walkInfo={!hideWalkInfo ? walkInfo : undefined}
        >
            {filterMap(routes, (route) => {
                const routeData = groupedDepartures[route]
                const firstRouteData = routeData && routeData[0]
                if (!firstRouteData) return

                const subType = firstRouteData.subType
                const routeType = firstRouteData.type
                const icon = getIcon(routeType, iconColorType, subType)
                const platform = firstRouteData.quay?.publicCode
                return (
                    <TileRow
                        key={route}
                        label={route}
                        subLabels={routeData.map(createTileSubLabel)}
                        icon={icon}
                        hideSituations={hideSituations}
                        hideTracks={hideTracks}
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
    walkInfo?: WalkInfo
}

export { DepartureTile }
