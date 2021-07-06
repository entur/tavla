import React, { useState, useEffect } from 'react'
import { colors } from '@entur/tokens'
import { Heading2, Heading3 } from '@entur/typography'
import {
    Table,
    TableBody,
    TableRow,
    DataCell,
    TableHead,
    HeaderCell,
} from '@entur/table'

import {
    getIcon,
    unique,
    getTransportIconIdentifier,
    createTileSubLabel,
    isNotNullOrUndefined,
    getIconColorType,
} from '../../../utils'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'

import SubLabelIcon from '../components/SubLabelIcon'
import './styles.scss'
import { useSettingsContext } from '../../../settings'
import ExclamationIcon from '../../../components/ExclamationIcon/exclamation'

function getTransportHeaderIcons(departures: LineData[]): JSX.Element[] {
    const transportModes = unique(
        departures.map(({ type, subType }) => ({ type, subType })),
        (a, b) =>
            getTransportIconIdentifier(a.type, a.subType) ===
            getTransportIconIdentifier(b.type, b.subType),
    )

    const transportIcons = transportModes.map(({ type, subType }) => ({
        icon: getIcon(type, undefined, subType, colors.blues.blue60),
    }))

    return transportIcons.map(({ icon }) => icon).filter(isNotNullOrUndefined)
}

function isMobileWeb(): boolean {
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    )
}

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures } = stopPlaceWithDepartures
    const headerIcons = getTransportHeaderIcons(departures)
    const [settings] = useSettingsContext()
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )
    const isMobile = isMobileWeb()

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])
    return (
        <div className="tile">
            <header className="tile__header">
                <Heading2>{stopPlaceWithDepartures.name}</Heading2>
                <div className="tile__header__icons">{headerIcons}</div>
            </header>
            <Table spacing="small" fixed>
                <col
                    style={
                        !isMobile
                            ? { width: '4%', minWidth: '2rem' }
                            : { width: '15%' }
                    }
                />
                <col style={!isMobile ? { width: '26%' } : { width: '38%' }} />
                <col
                    style={
                        !isMobile
                            ? { width: '9%', minWidth: '5rem' }
                            : { width: '31%' }
                    }
                />
                <col style={!isMobile ? { width: '62%' } : { width: '16%' }} />
                <TableHead>
                    <TableRow className="tableRow">
                        <HeaderCell> </HeaderCell>
                        <HeaderCell>Linje</HeaderCell>
                        <HeaderCell>Avgang</HeaderCell>
                        <HeaderCell>Avvik</HeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departures.map((data) => (
                        <TableRow key={data.id}>
                            <DataCell>
                                <Heading3>
                                    <div>
                                        {getIcon(
                                            data.type,
                                            iconColorType,
                                            data.subType,
                                        )}
                                    </div>
                                </Heading3>
                            </DataCell>
                            <DataCell>
                                <Heading3 className="tile__header__header3">
                                    {data.route}
                                </Heading3>
                            </DataCell>
                            <DataCell>{data.time}</DataCell>
                            <DataCell>
                                {isMobile && data?.situation ? (
                                    <ExclamationIcon
                                        alertMessage={data?.situation}
                                    />
                                ) : (
                                    <SubLabelIcon
                                        subLabel={createTileSubLabel(data)}
                                    />
                                )}
                            </DataCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
}

export default DepartureTile
