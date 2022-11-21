import React, { useMemo } from 'react'
import { groupBy } from 'lodash'
import { Loader } from '@entur/loader'
import { CompactTileRow } from '../CompactTileRow/CompactTileRow'
import { useSettings } from '../../../settings/SettingsProvider'
import {
    getIcon,
    getIconColorType,
    getTransportHeaderIcons,
} from '../../../utils/icon'
import { Tile } from '../../../components/Tile/Tile'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import { useStopPlaceWithEstimatedCalls } from '../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import {
    filterHidden,
    toDeparture,
} from '../../../logic/use-stop-place-with-estimated-calls/departure'
import { WalkTrip } from '../../../components/WalkTrip/WalkTrip'
import { createTileSubLabel } from '../../../utils/utils'
import { ErrorTile } from '../../../components/ErrorTile/ErrorTile'
import classes from './CompactDepartureTile.module.scss'

interface CompactDepartureTileProps {
    stopPlaceId: string
}

const CompactDepartureTile: React.FC<CompactDepartureTileProps> = ({
    stopPlaceId,
}) => {
    const [settings] = useSettings()
    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls(stopPlaceId)

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHidden(stopPlaceId, settings)) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, stopPlaceId, settings],
    )

    const groupedDepartures = useMemo(
        () => groupBy(departures, 'route'),
        [departures],
    )

    if (loading) {
        return (
            <Tile className={classes.CompactDepartureTile}>
                <Loader>Laster</Loader>
            </Tile>
        )
    }

    if (!stopPlaceWithEstimatedCalls) {
        return <ErrorTile className={classes.CompactDepartureTile} />
    }

    return (
        <Tile className={classes.CompactDepartureTile}>
            <TileHeader
                title={stopPlaceWithEstimatedCalls.name}
                icons={getTransportHeaderIcons(departures, iconColorType)}
            />
            <WalkTrip
                coordinates={{
                    latitude: stopPlaceWithEstimatedCalls.latitude,
                    longitude: stopPlaceWithEstimatedCalls.longitude,
                }}
            />
            {Object.entries(groupedDepartures).map(([key, lines]) => {
                const firstLine = lines[0]
                if (!firstLine) return

                const icon = getIcon(
                    firstLine.transportMode,
                    iconColorType,
                    firstLine.transportSubmode,
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
                        type={firstLine.transportMode}
                    />
                )
            })}
        </Tile>
    )
}

export { CompactDepartureTile }
