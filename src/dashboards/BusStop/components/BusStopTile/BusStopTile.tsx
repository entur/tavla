import React, { useMemo } from 'react'
import { Table, TableRow, TableHead, HeaderCell, TableBody } from '@entur/table'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../../types'
import { useSettings } from '../../../../settings/SettingsProvider'
import { WalkInfo } from '../../../../logic/use-walk-info/useWalkInfo'
import { BusStopHeader } from '../BusStopHeader/BusStopHeader'
import { BusStopTableRow } from '../BusStopTableRow/BusStopTableRow'
import { isNotNullOrUndefined } from '../../../../utils/typeguards'
import { unique } from '../../../../utils/array'
import {
    getIcon,
    getIconColorType,
    getTransportIconIdentifier,
} from '../../../../utils/icon'
import css from './BusStopTile.module.scss'

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
        <div className={css.busStopTile}>
            <BusStopHeader
                title={name}
                icons={getTransportHeaderIcons(departures, iconColorType)}
                walkInfo={!settings.hideWalkInfo ? walkInfo : undefined}
            />
            <Table spacing="large" fixed>
                <TableHead className={css.tableHead}>
                    <TableRow>
                        <HeaderCell className={css.tableHeadIcon}> </HeaderCell>
                        <HeaderCell>Linje</HeaderCell>
                        <HeaderCell className={css.tableHeadDeparture}>
                            Avgang
                        </HeaderCell>
                        {!settings.hideTracks && (
                            <HeaderCell className={css.tableHeadTrack}>
                                Spor
                            </HeaderCell>
                        )}
                        {!settings.hideSituations && (
                            <HeaderCell className={css.tableHeadSituation}>
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
        </div>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
    walkInfo?: WalkInfo
}

export { BusStopTile }
