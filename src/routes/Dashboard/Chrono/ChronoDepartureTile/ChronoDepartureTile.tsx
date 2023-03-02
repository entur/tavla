import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Tile } from 'components/Tile'
import { useSettings } from 'settings/SettingsProvider'
import { getIconColorType, getTransportHeaderIcons } from 'utils/icon'
import { TileHeader } from 'components/TileHeader'
import { useStopPlaceWithEstimatedCalls } from 'hooks/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import {
    byDepartureTime,
    filterHidden,
    toDeparture,
} from 'hooks/use-stop-place-with-estimated-calls/departure'
import { WalkTrip } from 'components/WalkTrip/WalkTrip'
import { Loader } from 'components/Loader'
import { ErrorTile } from 'tiles/dashboard/ErrorTile'
import { EmptyStopTile } from 'tiles/dashboard/EmptyStopTile'
import { HeaderCell, Table, TableHead, TableRow } from '@entur/table'
import { ChronoTableRows } from '../ChronoTableRows/ChronoTableRows'
import classes from './ChronoDepartureTile.module.scss'

function ChronoDepartureTile({ stopPlaceId }: { stopPlaceId: string }) {
    const [settings] = useSettings()
    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({
            stopPlaceId,
            numberOfDeparturesPerLineAndDestinationDisplay: 20,
            hiddenStopModes: settings.hiddenStopModes,
        })

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHidden(stopPlaceId, settings))
                .sort(byDepartureTime) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, stopPlaceId, settings],
    )

    if (loading) {
        return (
            <Tile className={classes.ChronoDepartureTile}>
                <Loader />
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
