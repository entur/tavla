import React, { useMemo } from 'react'
import { Table, TableRow, TableHead, HeaderCell, TableBody } from '@entur/table'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../../types'
import { useSettings } from '../../../../settings/SettingsProvider'
import { WalkInfo } from '../../../../logic/use-walk-info/useWalkInfo'
import { BusStopTableRow } from '../BusStopTableRow/BusStopTableRow'
import { isNotNullOrUndefined } from '../../../../utils/typeguards'
import { unique } from '../../../../utils/array'
import {
    getIcon,
    getIconColorType,
    getTransportIconIdentifier,
} from '../../../../utils/icon'
import { Tile } from '../../../../components/Tile/Tile'
import { TileHeader } from '../../../../components/TileHeader/TileHeader'
import classes from './BusStopTile.module.scss'

function getTransportHeaderIcons(
    departures: LineData[],
    iconColorType: IconColorType,
): JSX.Element[] {
    const transportModes = unique(
        departures.map(({ type, subType }) => ({ type, subType })),
        (a, b) =>
            getTransportIconIdentifier(a.type, a.subType) ===
            getTransportIconIdentifier(b.type, b.subType),
    )

    const transportIcons = transportModes.map(({ type, subType }) => ({
        icon: getIcon(type, iconColorType, subType),
    }))

    return transportIcons.map(({ icon }) => icon).filter(isNotNullOrUndefined)
}

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
        <Tile>
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
