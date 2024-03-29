import React, { useMemo } from 'react'
import { groupBy } from 'lodash'
import { Tile } from 'components/Tile'
import { useSettings } from 'settings/SettingsProvider'
import { getIconColorType, getTransportHeaderIcons } from 'utils/icon'
import { TileHeader } from 'components/TileHeader'
import { useStopPlaceWithEstimatedCalls } from 'hooks/useStopPlaceWithEstimatedCalls'
import {
    filterHiddenRoutes,
    toDeparture,
    createTileSubLabel,
} from 'utils/utils'
import { WalkTrip } from 'components/WalkTrip'
import { TransportModeIcon } from 'assets/icons/TransportModeIcon'
import { Loader } from 'components/Loader'
import { EmptyStopTile } from 'tiles/dashboard/EmptyStopTile'
import { ErrorTile } from 'tiles/dashboard/ErrorTile'
import { CompactTileRow } from '../CompactTileRow/CompactTileRow'
import classes from './CompactDepartureTile.module.scss'

function CompactDepartureTile({ stopPlaceId }: { stopPlaceId: string }) {
    const [settings] = useSettings()
    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({
            stopPlaceId,
            hiddenStopModes: settings.hiddenStopModes,
        })

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHiddenRoutes(stopPlaceId, settings)) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, stopPlaceId, settings],
    )

    const groupedDepartures = useMemo(
        () => groupBy(departures, 'route'),
        [departures],
    )

    if (loading) {
        return (
            <Tile className={classes.CompactDepartureTile}>
                <Loader />
            </Tile>
        )
    }

    if (!stopPlaceWithEstimatedCalls) {
        return <ErrorTile className={classes.CompactDepartureTile} />
    }

    if (!departures.length) {
        return (
            <EmptyStopTile
                className={classes.CompactDepartureTile}
                title={stopPlaceWithEstimatedCalls.name}
            />
        )
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
                hideWalkInfo={settings.hideWalkInfo}
            />
            {Object.entries(groupedDepartures).map(([key, lines]) => {
                const firstLine = lines[0]
                if (!firstLine) return

                return (
                    <CompactTileRow
                        key={key}
                        label={key}
                        subLabels={lines.map(createTileSubLabel)}
                        icon={
                            <TransportModeIcon
                                transportMode={firstLine.transportMode}
                                iconColorType={iconColorType}
                                transportSubmode={firstLine.transportSubmode}
                            />
                        }
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
