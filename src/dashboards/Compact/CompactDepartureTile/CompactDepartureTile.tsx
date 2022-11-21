import React, { useMemo } from 'react'
import { groupBy } from 'lodash'
import { createTileSubLabel } from '../../../utils/utils'
import { StopPlaceWithDepartures, LineData } from '../../../types'
import { CompactTileRow } from '../CompactTileRow/CompactTileRow'
import { useSettings } from '../../../settings/SettingsProvider'
import { WalkInfo } from '../../../logic/use-walk-info/useWalkInfo'
import {
    getIcon,
    getIconColorType,
    getTransportHeaderIcons,
} from '../../../utils/icon'
import { Tile } from '../../../components/Tile/Tile'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import classes from './CompactDepartureTile.module.scss'

interface CompactDepartureTileProps {
    stopPlaceWithDepartures: StopPlaceWithDepartures
    walkInfo?: WalkInfo
}

const CompactDepartureTile: React.FC<CompactDepartureTileProps> = ({
    stopPlaceWithDepartures,
    walkInfo,
}) => {
    const groupedDepartures = groupBy<LineData>(
        stopPlaceWithDepartures.departures,
        'route',
    )
    const [settings] = useSettings()
    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    return (
        <Tile className={classes.CompactDepartureTile}>
            <TileHeader
                title={stopPlaceWithDepartures.name}
                icons={getTransportHeaderIcons(
                    stopPlaceWithDepartures.departures,
                    iconColorType,
                )}
                walkInfo={!settings.hideWalkInfo ? walkInfo : undefined}
            />
            {Object.entries(groupedDepartures).map(([key, lines]) => {
                const firstLine = lines[0]
                if (!firstLine) return

                const icon = getIcon(
                    firstLine.type,
                    iconColorType,
                    firstLine.subType,
                )

                return (
                    <CompactTileRow
                        key={key}
                        label={key}
                        subLabels={lines.map(createTileSubLabel)}
                        icon={icon}
                        hideSituations={settings.hideSituations}
                        hideTracks={settings.hideTracks}
                        platform={firstLine.quay?.publicCode}
                        type={firstLine.type}
                    />
                )
            })}
        </Tile>
    )
}

export { CompactDepartureTile }
