import React, { useState, useEffect } from 'react'
import { Table, TableRow, TableHead, HeaderCell } from '@entur/table'

import {
    getIcon,
    unique,
    getTransportIconIdentifier,
    isNotNullOrUndefined,
    getIconColorType,
} from '../../../utils'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'

import './styles.scss'
import { useSettingsContext } from '../../../settings'
import { WalkInfo } from '../../../logic/useWalkInfo'
import Tile from '../components/Tile'
import TileRows from '../components/TileRows'

function getTransportHeaderIcons(departures: LineData[]): JSX.Element[] {
    const transportModes = unique(
        departures.map(({ type, subType }) => ({ type, subType })),
        (a, b) =>
            getTransportIconIdentifier(a.type, a.subType) ===
            getTransportIconIdentifier(b.type, b.subType),
    )

    const transportIcons = transportModes.map(({ type, subType }) => ({
        icon: getIcon(type, undefined, subType),
    }))

    return transportIcons.map(({ icon }) => icon).filter(isNotNullOrUndefined)
}

function getRowSizes(
    isMobile: boolean,
    hideTracks: boolean | undefined,
    hideSituations: boolean | undefined,
) {
    const getRowSize = (desktopWidth: string, mobileWidth: string) => (
        <col
            style={!isMobile ? { width: desktopWidth } : { width: mobileWidth }}
        />
    )
    return (
        <>
            {getRowSize('10%', '10%')}
            {!hideTracks && !hideSituations
                ? getRowSize('24%', '43%')
                : !hideTracks || !hideSituations
                ? getRowSize('42', '42%')
                : getRowSize('60%', '60%')}
            {getRowSize('18%', '22%')}
            {!hideTracks ? getRowSize('18%', '13%') : null}
            {!hideSituations ? getRowSize('30%', '11%') : null}
        </>
    )
}

const DepartureTile = ({
    stopPlaceWithDepartures,
    walkInfo,
    isMobile = false,
    numberOfTileRows = 10,
}: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const headerIcons = getTransportHeaderIcons(departures)
    const [settings] = useSettingsContext()
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

    return (
        <Tile
            title={name}
            icons={headerIcons}
            walkInfo={!hideWalkInfo ? walkInfo : undefined}
        >
            <Table spacing="small" fixed>
                {getRowSizes(isMobile, hideTracks, hideSituations)}
                <TableHead>
                    <TableRow className="tableRow">
                        <HeaderCell></HeaderCell>
                        <HeaderCell>Linje</HeaderCell>
                        <HeaderCell>Avgang</HeaderCell>
                        {!hideTracks ? <HeaderCell>Spor</HeaderCell> : null}
                        {!hideSituations ? (
                            <HeaderCell>Avvik</HeaderCell>
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

export default DepartureTile
