import React, { useMemo } from 'react'
import { Tile } from 'components/Tile'
import { useSettings } from 'settings/SettingsProvider'
import { getIconColorType, getTransportHeaderIcons } from 'utils/icon'
import { TileHeader } from 'components/TileHeader'
import { useStopPlaceWithEstimatedCalls } from 'hooks/useStopPlaceWithEstimatedCalls'
import { byDepartureTime, filterHiddenRoutes, toDeparture } from 'utils/utils'
import { Loader } from 'components/Loader'
import { WalkTrip } from 'components/WalkTrip'
import { ErrorTile } from 'tiles/dashboard/ErrorTile'
import { EmptyStopTile } from 'tiles/dashboard/EmptyStopTile'
import { SubLabel } from '@entur/typography'
import { Table, TableRow, TableHead, HeaderCell, TableBody } from '@entur/table'
import { BusStopTableRow } from '../BusStopTableRow/BusStopTableRow'
import classes from './BusStopTile.module.scss'

function BusStopTile({ stopPlaceId }: { stopPlaceId: string }) {
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
                .filter(filterHiddenRoutes(stopPlaceId, settings))
                .sort(byDepartureTime) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, settings, stopPlaceId],
    )

    if (loading) {
        return (
            <Tile className={classes.BusStopTile}>
                <Loader />
            </Tile>
        )
    }

    if (!stopPlaceWithEstimatedCalls) {
        return <ErrorTile className={classes.BusStopTile} />
    }

    if (!departures.length) {
        return (
            <EmptyStopTile
                className={classes.BusStopTile}
                title={stopPlaceWithEstimatedCalls.name}
            />
        )
    }

    return (
        <Tile className={classes.BusStopTile}>
            <div className={classes.TileHeader}>
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
            </div>
            <Table spacing="large">
                <TableHead className={classes.TableHead}>
                    <TableRow className={classes.TableRow}>
                        <HeaderCell className={classes.Cell}>
                            Linje
                            <br />
                            <SubLabel className={classes.Cell}>Line</SubLabel>
                        </HeaderCell>
                        <HeaderCell className={classes.Cell}>
                            Destinasjon
                            <br />
                            <SubLabel className={classes.Cell}>
                                Destination
                            </SubLabel>
                        </HeaderCell>
                        <HeaderCell className={classes.Cell}>
                            Avgang
                            <br />
                            <SubLabel className={classes.Cell}>
                                Departure
                            </SubLabel>
                        </HeaderCell>
                        {!settings.hideTracks && (
                            <HeaderCell className={classes.Cell}>
                                Plattform
                                <br />
                                <SubLabel className={classes.Cell}>
                                    Platform
                                </SubLabel>
                            </HeaderCell>
                        )}
                        {!settings.hideSituations && (
                            <HeaderCell className={classes.Cell}>
                                Avvik
                                <br />
                                <SubLabel className={classes.Cell}>
                                    Deviations
                                </SubLabel>
                            </HeaderCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departures.map((departure) => (
                        <BusStopTableRow
                            key={departure.id}
                            departure={departure}
                            hideSituations={settings.hideSituations}
                            hideTracks={settings.hideTracks}
                        />
                    ))}
                </TableBody>
            </Table>
        </Tile>
    )
}

export { BusStopTile }
