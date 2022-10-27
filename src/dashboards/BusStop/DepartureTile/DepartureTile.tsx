import React, { useState, useEffect } from 'react'
import { Table, TableRow, TableHead, HeaderCell } from '@entur/table'
import {
    getIcon,
    getTransportIconIdentifier,
    getIconColorType,
} from '../../../utils'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'
import { useSettings } from '../../../settings/SettingsProvider'
import { WalkInfo } from '../../../logic/use-walk-info/useWalkInfo'
import { Tile } from '../components/Tile/Tile'
import { TileRows } from '../components/TileRows/TileRows'
import { isNotNullOrUndefined } from '../../../utils/typeguards'
import { unique } from '../../../utils/array'
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

function getColSizes(
    isMobile: boolean,
    hideTracks: boolean | undefined,
    hideSituations: boolean | undefined,
): Record<string, React.CSSProperties | undefined> {
    const getColSize = (desktopWidth: string, mobileWidth: string) =>
        !isMobile ? { width: desktopWidth } : { width: mobileWidth }

    return {
        iconCol: getColSize('10%', '10%'),
        lineCol:
            !hideTracks && !hideSituations
                ? getColSize('24%', '43%')
                : !hideTracks || !hideSituations
                ? getColSize('42', '42%')
                : getColSize('60%', '60%'),
        departureCol: getColSize('18%', '22%'),
        trackCol: !hideTracks ? getColSize('18%', '13%') : undefined,
        situationCol: !hideSituations ? getColSize('30%', '11%') : undefined,
    }
}

const DepartureTile = ({
    stopPlaceWithDepartures,
    walkInfo,
    isMobile = false,
    numberOfTileRows = 10,
}: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const [settings] = useSettings()
    const { hideSituations, hideTracks, hideWalkInfo } = settings || {}
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

    const columnSizes = getColSizes(isMobile, hideTracks, hideSituations)

    return (
        <Tile
            title={name}
            icons={getTransportHeaderIcons(departures, iconColorType)}
            walkInfo={!hideWalkInfo ? walkInfo : undefined}
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
                        {!hideTracks ? (
                            <HeaderCell style={columnSizes.trackCol}>
                                Spor
                            </HeaderCell>
                        ) : null}
                        {!hideSituations ? (
                            <HeaderCell style={columnSizes.situationCol}>
                                Avvik
                            </HeaderCell>
                        ) : null}
                    </TableRow>
                </TableHead>
                <TileRows
                    visibleDepartures={visibleDepartures}
                    hideSituations={hideSituations}
                    hideTracks={hideTracks}
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
