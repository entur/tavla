import React, { useMemo } from 'react'
import classNames from 'classnames'
import { HeaderCell, Table, TableHead, TableRow } from '@entur/table'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'
import { ChronoTableRows } from '../ChronoTileRows/ChronoTableRows'
import { useSettings } from '../../../settings/SettingsProvider'
import { WalkInfo } from '../../../logic/use-walk-info/useWalkInfo'
import { isNotNullOrUndefined } from '../../../utils/typeguards'
import { unique } from '../../../utils/array'
import {
    getIcon,
    getIconColorType,
    getTransportIconIdentifier,
} from '../../../utils/icon'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import { Tile } from '../../../components/Tile/Tile'
import css from './ChronoDepartureTile.module.scss'

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

interface ChronoDepartureTileProps {
    stopPlaceWithDepartures: StopPlaceWithDepartures
    walkInfo?: WalkInfo
    isMobile?: boolean
    numberOfTileRows?: number
}

const ChronoDepartureTile: React.FC<ChronoDepartureTileProps> = ({
    stopPlaceWithDepartures,
    walkInfo,
    isMobile = false,
    numberOfTileRows = 7,
}) => {
    const { departures, name } = stopPlaceWithDepartures
    const [settings] = useSettings()

    const limitedDepartures = departures.slice(0, numberOfTileRows)
    const visibleDepartures = isMobile ? limitedDepartures : departures

    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    return (
        <Tile className={css.chronoDepartureTile}>
            <TileHeader
                title={name}
                icons={getTransportHeaderIcons(departures, iconColorType)}
                walkInfo={!settings.hideWalkInfo ? walkInfo : undefined}
            />
            <Table fixed>
                <TableHead className={css.tableHead}>
                    <TableRow>
                        <HeaderCell className={css.tableHeadIcon}> </HeaderCell>
                        <HeaderCell
                            className={classNames(
                                css.tableHeadCell,
                                css.tableHeadLine,
                                {
                                    [css.tableHeadLine__oneVisible]:
                                        !settings.hideTracks ||
                                        !settings.hideSituations,
                                    [css.tableHeadLine__bothVisible]:
                                        !settings.hideTracks &&
                                        !settings.hideSituations,
                                },
                            )}
                        >
                            Linje
                        </HeaderCell>
                        <HeaderCell
                            className={classNames(
                                css.tableHeadCell,
                                css.tableHeadDeparture,
                            )}
                        >
                            Avgang
                        </HeaderCell>
                        {!settings.hideTracks && (
                            <HeaderCell
                                className={classNames(
                                    css.tableHeadCell,
                                    css.tableHeadTrack,
                                )}
                            >
                                Spor
                            </HeaderCell>
                        )}
                        {!settings.hideSituations && (
                            <HeaderCell
                                className={classNames(
                                    css.tableHeadCell,
                                    css.tableHeadSituation,
                                )}
                            >
                                Avvik
                            </HeaderCell>
                        )}
                    </TableRow>
                </TableHead>
                <ChronoTableRows
                    visibleDepartures={visibleDepartures}
                    hideSituations={settings.hideSituations}
                    hideTracks={settings.hideTracks}
                    iconColorType={iconColorType}
                />
            </Table>
        </Tile>
    )
}

export { ChronoDepartureTile }
