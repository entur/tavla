import React, { useMemo } from 'react'
import { Table, TableRow, TableHead, HeaderCell, TableBody } from '@entur/table'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'
import { useSettings } from '../../../settings/SettingsProvider'
import { WalkInfo } from '../../../logic/use-walk-info/useWalkInfo'
import { Tile } from '../components/Tile/Tile'
import { TileRow } from '../components/TileRow/TileRow'
import { isNotNullOrUndefined } from '../../../utils/typeguards'
import { unique } from '../../../utils/array'
import {
    getIcon,
    getIconColorType,
    getTransportIconIdentifier,
} from '../../../utils/icon'
import './DepartureTile.scss'

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

const DepartureTile = ({
    stopPlaceWithDepartures,
    walkInfo,
}: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const [settings] = useSettings()

    const iconColorType = useMemo(
        () => getIconColorType(settings?.theme),
        [settings?.theme],
    )

    return (
        <Tile
            title={name}
            icons={getTransportHeaderIcons(departures, iconColorType)}
            walkInfo={!settings.hideWalkInfo ? walkInfo : undefined}
        >
            <Table spacing="small" fixed>
                <TableHead>
                    <TableRow className="tableRow">
                        <HeaderCell className="bus-stop-departure-tile-head-icon">
                            {' '}
                        </HeaderCell>
                        <HeaderCell>Linje</HeaderCell>
                        <HeaderCell className="bus-stop-departure-tile-head-departure">
                            Avgang
                        </HeaderCell>
                        {!settings.hideTracks ? (
                            <HeaderCell className="bus-stop-departure-tile-head-track">
                                Spor
                            </HeaderCell>
                        ) : null}
                        {!settings.hideSituations ? (
                            <HeaderCell className="bus-stop-departure-tile-head-situation">
                                Avvik
                            </HeaderCell>
                        ) : null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departures.map((departure) => (
                        <TileRow
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

export { DepartureTile }
