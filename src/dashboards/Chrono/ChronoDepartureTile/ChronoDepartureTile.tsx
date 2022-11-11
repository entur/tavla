import React, { useMemo } from 'react'
import classNames from 'classnames'
import { HeaderCell, Table, TableHead, TableRow } from '@entur/table'
import { StopPlaceWithDepartures } from '../../../types'
import { ChronoTableRows } from '../ChronoTileRows/ChronoTableRows'
import { useSettings } from '../../../settings/SettingsProvider'
import { WalkInfo } from '../../../logic/use-walk-info/useWalkInfo'
import { getIconColorType, getTransportHeaderIcons } from '../../../utils/icon'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import { Tile } from '../../../components/Tile/Tile'
import classes from './ChronoDepartureTile.module.scss'

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
        <Tile className={classes.ChronoDepartureTile}>
            <TileHeader
                title={name}
                icons={getTransportHeaderIcons(departures, iconColorType)}
                walkInfo={!settings.hideWalkInfo ? walkInfo : undefined}
            />
            <Table fixed>
                <TableHead className={classes.TableHead}>
                    <TableRow>
                        <HeaderCell className={classes.Icon}> </HeaderCell>
                        <HeaderCell
                            className={classNames(classes.Cell, classes.Line, {
                                [classes.Line__oneVisible]:
                                    !settings.hideTracks ||
                                    !settings.hideSituations,
                                [classes.Line__bothVisible]:
                                    !settings.hideTracks &&
                                    !settings.hideSituations,
                            })}
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
                                Spor
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
