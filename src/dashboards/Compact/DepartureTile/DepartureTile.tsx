import React, { useState, useEffect } from 'react'
import { groupBy } from 'lodash'
import { createTileSubLabel } from '../../../utils/utils'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'
import { Tile } from '../components/Tile/Tile'
import { TileRow } from '../components/TileRow/TileRow'
import { useSettings } from '../../../settings/SettingsProvider'
import { WalkInfo } from '../../../logic/use-walk-info/useWalkInfo'
import {
    getIcon,
    getIconColorType,
    getTransportHeaderIcons,
} from '../../../utils/icon'

const DepartureTile = ({
    stopPlaceWithDepartures,
    walkInfo,
}: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const groupedDepartures = groupBy<LineData>(departures, 'route')
    const routes = Object.keys(groupedDepartures)
    const [settings] = useSettings()

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
            walkInfo={!settings.hideWalkInfo ? walkInfo : undefined}
        >
            {routes.map((route) => {
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
                        hideSituations={settings.hideSituations}
                        hideTracks={settings.hideTracks}
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
