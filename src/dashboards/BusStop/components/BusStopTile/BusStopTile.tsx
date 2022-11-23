import React, { useMemo } from 'react'
import { Table, TableRow, TableHead, HeaderCell, TableBody } from '@entur/table'
import { Loader } from '@entur/loader'
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
    filterHidden,
    toDeparture,
} from '../../../../logic/use-stop-place-with-estimated-calls/departure'
import { WalkTrip } from '../../../../components/WalkTrip/WalkTrip'
import { ErrorTile } from '../../../../components/ErrorTile/ErrorTile'
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
        useStopPlaceWithEstimatedCalls(stopPlaceId)

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHidden(stopPlaceId, settings)) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, settings, stopPlaceId],
    )

    if (loading) {
        return (
            <Tile className={classes.BusStopTile}>
                <Loader>Laster</Loader>
            </Tile>
        )
    }

    if (!stopPlaceWithEstimatedCalls) {
        return <ErrorTile className={classes.BusStopTile} />
    }

    return (
        <Tile className={classes.BusStopTile}>
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
            <Table spacing="large" fixed>
                <TableHead className={classes.TableHead}>
                    <TableRow>
                        <HeaderCell className={classes.Icon}> </HeaderCell>
                        <HeaderCell>Linje</HeaderCell>
                        <HeaderCell className={classes.Departure}>
                            Avgang
                        </HeaderCell>
                        {!settings.hideTracks && (
                            <HeaderCell className={classes.Track}>
                                Plattform
                            </HeaderCell>
                        )}
                        {!settings.hideSituations && (
                            <HeaderCell className={classes.Situation}>
                                Avvik
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
                            iconColorType={iconColorType}
                        />
                    ))}
                </TableBody>
            </Table>
        </Tile>
    )
}

export { BusStopTile }
