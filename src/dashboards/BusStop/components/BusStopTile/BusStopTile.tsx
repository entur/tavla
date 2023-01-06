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
        useStopPlaceWithEstimatedCalls({ stopPlaceId })

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
                <p tabIndex={0} className={classes.UuText}>
                    Neste avganger fra {stopPlaceWithEstimatedCalls.name} er{' '}
                    {departures[0]?.transportMode} {departures[0]?.route} om{' '}
                    {departures[0]?.time}, {departures[1]?.transportMode}{' '}
                    {departures[1]?.route} om {departures[1]?.time} og{' '}
                    {departures[2]?.transportMode} {departures[2]?.route} om{' '}
                    {departures[2]?.time}
                </p>
            </div>

            <Table spacing="large" fixed>
                <TableHead className={classes.TableHead}>
                    <TableRow className={classes.TableRow}>
                        <HeaderCell className={classes.Cell}>
                            Linje
                            <br />
                            <SubLabel>Line</SubLabel>
                        </HeaderCell>
                        <HeaderCell className={classes.Cell}>
                            Destinasjon
                            <br />
                            <SubLabel>Destination</SubLabel>
                        </HeaderCell>
                        <HeaderCell className={classes.Cell}>
                            Avgang
                            <br />
                            <SubLabel>Departure</SubLabel>
                        </HeaderCell>
                        {!settings.hideTracks && (
                            <HeaderCell className={classes.Cell}>
                                Plattform
                                <br />
                                <SubLabel>Platform</SubLabel>
                            </HeaderCell>
                        )}
                        {!settings.hideSituations && (
                            <HeaderCell className={classes.Cell}>
                                Avvik
                                <br />
                                <SubLabel>Deviations</SubLabel>
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
