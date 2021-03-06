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
import SituationModal from '../../../components/SituationModal'

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
    const { hideSituations } = settings || {}
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
                <col style={!isMobile ? { width: '26%' } : { width: '41%' }} />
                <col
                    style={
                        !isMobile
                            ? { width: '9%', minWidth: '5rem' }
                            : { width: '28%' }
                    }
                />
                <col style={!isMobile ? { width: '62%' } : { width: '16%' }} />
                <TableHead>
                    <TableRow className="tableRow">
                        <HeaderCell> </HeaderCell>
                        <HeaderCell>Linje</HeaderCell>
                        <HeaderCell>Avgang</HeaderCell>
                        {!hideSituations ? (
                            <HeaderCell>Avvik</HeaderCell>
                        ) : null}
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
                                {!hideSituations ? (
                                    <div>
                                        {isMobile && data?.situation ? (
                                            <SituationModal
                                                situationMessage={
                                                    data?.situation
                                                }
                                            />
                                        ) : (
                                            <SubLabelIcon
                                                subLabel={createTileSubLabel(
                                                    data,
                                                )}
                                            />
                                        )}
                                    </div>
                                ) : null}
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
