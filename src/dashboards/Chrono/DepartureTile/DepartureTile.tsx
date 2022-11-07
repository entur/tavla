import React, { useState, useEffect } from 'react'
import { HeaderCell, Table, TableHead, TableRow } from '@entur/table'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'
import { Tile } from '../components/Tile/Tile'
import { TileRows } from '../components/TileRows/TileRows'
import { useSettings } from '../../../settings/SettingsProvider'
import { WalkInfo } from '../../../logic/use-walk-info/useWalkInfo'
import { isNotNullOrUndefined } from '../../../utils/typeguards'
import { unique } from '../../../utils/array'
import {
    getIcon,
    getIconColorType,
    getTransportIconIdentifier,
} from '../../../utils/icon'

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

function getColumnSizes(
    isMobile: boolean,
    hideTracks: boolean | undefined,
    hideSituations: boolean | undefined,
): Record<string, React.CSSProperties | undefined> {
    const getColSize = (desktopWidth: string, mobileWidth: string) =>
        !isMobile ? { width: desktopWidth } : { width: mobileWidth }

    return {
        iconCol: getColSize('14%', '14%'),
        lineCol:
            !hideTracks && !hideSituations
                ? getColSize('44%', '38%')
                : !hideTracks || !hideSituations
                ? getColSize('54%', '49%')
                : getColSize('64%', '61%'),
        departureCol: getColSize('20%', '20%'),
        trackCol: !hideTracks ? getColSize('10%', '11%') : undefined,
        situationCol: !hideSituations ? getColSize('10%', '11%') : undefined,
    }
}

const DepartureTile = ({
    stopPlaceWithDepartures,
    walkInfo,
    isMobile = false,
    numberOfTileRows = 7,
}: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const [settings] = useSettings()
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )

    const limitedDepartures = departures.slice(0, numberOfTileRows)
    const visibleDepartures = isMobile ? limitedDepartures : departures

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

    const columnSizes = getColumnSizes(
        isMobile,
        settings.hideTracks,
        settings.hideSituations,
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
                        <HeaderCell style={columnSizes.iconCol}> </HeaderCell>
                        <HeaderCell style={columnSizes.lineCol}>
                            Linje
                        </HeaderCell>
                        <HeaderCell style={columnSizes.departureCol}>
                            Avgang
                        </HeaderCell>
                        {!settings.hideTracks && (
                            <HeaderCell style={columnSizes.trackCol}>
                                Spor
                            </HeaderCell>
                        )}
                        {!settings.hideSituations && (
                            <HeaderCell style={columnSizes.situationCol}>
                                Avvik
                            </HeaderCell>
                        )}
                    </TableRow>
                </TableHead>
                <TileRows
                    visibleDepartures={visibleDepartures}
                    hideSituations={settings.hideSituations}
                    hideTracks={settings.hideTracks}
                    iconColorType={iconColorType}
                />
            </Table>
        </Tile>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
    walkInfo?: WalkInfo
    isMobile?: boolean
    numberOfTileRows?: number
}

export { DepartureTile }
