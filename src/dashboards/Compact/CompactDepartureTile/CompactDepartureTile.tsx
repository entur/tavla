import React, { useMemo } from 'react'
import { groupBy } from 'lodash'
import { Loader } from '@entur/loader'
import { CompactTileRow } from '../CompactTileRow/CompactTileRow'
import { useSettings } from '../../../settings/SettingsProvider'
import { getIconColorType, getTransportHeaderIcons } from '../../../utils/icon'
import { Tile } from '../../../components/Tile/Tile'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import { useStopPlaceWithEstimatedCalls } from '../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import {
    filterHidden,
    toDeparture,
} from '../../../logic/use-stop-place-with-estimated-calls/departure'
import { WalkTrip } from '../../../components/WalkTrip/WalkTrip'
import { createTileSubLabel } from '../../../utils/utils'
import { TransportModeIcon } from '../../../components/TransportModeIcon/TransportModeIcon'
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

                return (
                    // eslint-disable-next-line react/jsx-key
                    <div>
                        <p tabIndex={0} className={classes.uuText}>
                            Linje {key} går om {lines[0]?.time} ,{' '}
                            {lines[1]?.time} og {lines[2]?.time}{' '}
                        </p>
                        <CompactTileRow
                            key={key}
                            label={key}
                            subLabels={lines.map(createTileSubLabel)}
                            icon={
                                <TransportModeIcon
                                    transportMode={firstLine.transportMode}
                                    iconColorType={iconColorType}
                                    transportSubmode={
                                        firstLine.transportSubmode
                                    }
                                />
                            }
                            hideSituations={settings.hideSituations}
                            hideTracks={settings.hideTracks}
                            platform={firstLine.quay?.publicCode}
                            type={firstLine.transportMode}
                        />
                    </div>
                )
            })}
        </Tile>
    )
}

export { CompactDepartureTile }
