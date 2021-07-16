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
    isMobileWeb,
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
import { WalkInfo } from '../../../logic/useWalkInfo'

const isMobile = isMobileWeb()

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

function formatWalkInfo(walkInfo: WalkInfo) {
    if (walkInfo.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkInfo.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkInfo.walkTime / 60)} min å gå (${Math.ceil(
            walkInfo.walkDistance,
        )} m)`
    }
}

const DepartureTile = ({
    stopPlaceWithDepartures,
    walkInfo,
}: Props): JSX.Element => {
    const { departures } = stopPlaceWithDepartures
    const headerIcons = getTransportHeaderIcons(departures)
    const [settings] = useSettingsContext()
    const { hideSituations, hideTracks, hideWalkInfo } = settings || {}
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )

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
            {walkInfo && !hideWalkInfo ? (
                <div className="tile__walking-time">
                    {formatWalkInfo(walkInfo)}
                </div>
            ) : null}
            <Table spacing="small" fixed>
                <col
                    style={
                        !isMobile
                            ? { width: '5%', minWidth: '2rem' }
                            : { width: '10%' }
                    }
                />
                <col style={!isMobile ? { width: '25%' } : { width: '35%' }} />
                <col
                    style={
                        !isMobile
                            ? { width: '7%', minWidth: '5rem' }
                            : { width: '23%' }
                    }
                />
                <col style={!isMobile ? { width: '20%' } : { width: '17%' }} />
                <col style={!isMobile ? { width: '43%' } : { width: '10%' }} />
                <TableHead>
                    <TableRow className="tableRow">
                        <HeaderCell> </HeaderCell>
                        <HeaderCell>Linje</HeaderCell>
                        <HeaderCell>Avgang</HeaderCell>
                        {!hideTracks ? <HeaderCell>Spor</HeaderCell> : null}
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
                            {!hideTracks ? (
                                <DataCell>
                                    {data.quay?.publicCode || '-'}
                                </DataCell>
                            ) : null}
                            {!hideSituations ? (
                                <DataCell>
                                    {isMobile && data?.situation ? (
                                        <SituationModal
                                            situationMessage={data?.situation}
                                        />
                                    ) : (
                                        <SubLabelIcon
                                            subLabel={createTileSubLabel(data)}
                                        />
                                    )}
                                </DataCell>
                            ) : null}
                        </TableRow>
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

export default DepartureTile
