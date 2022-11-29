import React, { useMemo } from 'react'
import classNames from 'classnames'
import { HeaderCell, Table, TableHead, TableRow } from '@entur/table'
import { Loader } from '@entur/loader'
import { ChronoTableRows } from '../ChronoTableRows/ChronoTableRows'
import { useSettings } from '../../../settings/SettingsProvider'
import { getIconColorType, getTransportHeaderIcons } from '../../../utils/icon'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import { Tile } from '../../../components/Tile/Tile'
import { useStopPlaceWithEstimatedCalls } from '../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import {
    filterHidden,
    toDeparture,
} from '../../../logic/use-stop-place-with-estimated-calls/departure'
import { WalkTrip } from '../../../components/WalkTrip/WalkTrip'
import { ErrorTile } from '../../../components/ErrorTile/ErrorTile'
import { EmptyStopTile } from '../../../components/EmptyStopTile/EmptyStopTile'
import classes from './ChronoDepartureTile.module.scss'

interface ChronoDepartureTileProps {
    stopPlaceId: string
}

const ChronoDepartureTile: React.FC<ChronoDepartureTileProps> = ({
    stopPlaceId,
}) => {
    const [settings] = useSettings()
    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({ stopPlaceId })

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHidden(stopPlaceId, settings)) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, stopPlaceId, settings],
    )

    if (loading) {
        return (
            <Tile className={classes.ChronoDepartureTile}>
                <Loader>Laster</Loader>
            </Tile>
        )
    }

    if (!stopPlaceWithEstimatedCalls) {
        return <ErrorTile className={classes.ChronoDepartureTile} />
    }

    if (!departures.length) {
        return (
            <EmptyStopTile
                className={classes.ChronoDepartureTile}
                title={stopPlaceWithEstimatedCalls.name}
            />
        )
    }

    return (
        <Tile className={classes.ChronoDepartureTile}>
            <TileHeader
                title={stopPlaceWithEstimatedCalls.name}
                icons={getTransportHeaderIcons(departures, iconColorType)}
            />
            <WalkTrip
                coordinates={{
                    longitude: stopPlaceWithEstimatedCalls.longitude,
                    latitude: stopPlaceWithEstimatedCalls.latitude,
                }}
            />
            <Table fixed>
                <TableHead className={classes.TableHead}>
                    <TableRow>
                        <HeaderCell className={classes.Icon}> </HeaderCell>
                        <HeaderCell
                            className={classNames(classes.Cell, classes.Line)}
                        >
                            Linje
                        </HeaderCell>
                        <HeaderCell
                            className={classNames(
                                classes.Cell,
                                classes.Departure,
                            )}
                        >
                            Avgang
                        </HeaderCell>
                        {!settings.hideTracks && (
                            <HeaderCell
                                className={classNames(
                                    classes.Cell,
                                    classes.Track,
                                )}
                            >
                                Plattform
                            </HeaderCell>
                        )}
                        {!settings.hideSituations && (
                            <HeaderCell
                                className={classNames(
                                    classes.Cell,
                                    classes.Situation,
                                )}
                            >
                                Avvik
                            </HeaderCell>
                        )}
                    </TableRow>
                </TableHead>
                <ChronoTableRows
                    visibleDepartures={departures}
                    hideSituations={settings.hideSituations}
                    hideTracks={settings.hideTracks}
                    iconColorType={iconColorType}
                />
            </Table>
        </Tile>
    )
}

export { ChronoDepartureTile }
