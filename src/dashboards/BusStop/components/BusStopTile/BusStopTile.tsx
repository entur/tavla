import React, { useMemo } from 'react'
import { Table, TableRow, TableHead, HeaderCell, TableBody } from '@entur/table'
import { SubLabel } from '@entur/typography'
import { useSettings } from '../../../../settings/SettingsProvider'
import { BusStopTableRow } from '../BusStopTableRow/BusStopTableRow'
import {
    getIconColorType,
    getTransportHeaderIcons,
} from '../../../../utils/icon'
import { Tile } from '../../../../components/Tile/Tile'
import { TileHeader } from '../../../../components/TileHeader/TileHeader'
import { useStopPlaceWithEstimatedCalls } from '../../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import {
    byDepartureTime,
    filterHidden,
    toDeparture,
} from '../../../../logic/use-stop-place-with-estimated-calls/departure'
import { WalkTrip } from '../../../../components/WalkTrip/WalkTrip'
import { ErrorTile } from '../../../../components/ErrorTile/ErrorTile'
import { EmptyStopTile } from '../../../../components/EmptyStopTile/EmptyStopTile'
import { Loader } from '../../../../components/Loader/Loader'
import classes from './BusStopTile.module.scss'

interface Props {
    stopPlaceId: string
}

const BusStopTile = ({ stopPlaceId }: Props): JSX.Element => {
    const [settings] = useSettings()
    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({ stopPlaceId, numberOfDepartures: 20 })

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHidden(stopPlaceId, settings))
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
