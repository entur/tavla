import React, { useMemo } from 'react'
import { Table, TableRow, TableHead, HeaderCell, TableBody } from '@entur/table'
import { StopPlaceWithDepartures } from '../../../../types'
import { useSettings } from '../../../../settings/SettingsProvider'
import { WalkInfo } from '../../../../logic/use-walk-info/useWalkInfo'
import { BusStopTableRow } from '../BusStopTableRow/BusStopTableRow'
import {
    getIconColorType,
    getTransportHeaderIcons,
} from '../../../../utils/icon'
import { Tile } from '../../../../components/Tile/Tile'
import { TileHeader } from '../../../../components/TileHeader/TileHeader'
import classes from './BusStopTile.module.scss'

const BusStopTile = ({
    stopPlaceWithDepartures,
    walkInfo,
}: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const [settings] = useSettings()

    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    return (
        <Tile className={classes.BusStopTile}>
            <TileHeader
                title={name}
                icons={getTransportHeaderIcons(departures, iconColorType)}
                walkInfo={!settings.hideWalkInfo ? walkInfo : undefined}
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
                                Spor
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

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
    walkInfo?: WalkInfo
}

export { BusStopTile }
