import React from 'react'
import { DataCell, TableRow } from '@entur/table'
import { IconColorType, LineData } from '../../../../types'
import { SituationIcon } from '../SituationIcon/SituationIcon'
import { getIcon } from '../../../../utils/icon'
import './TableRow.scss'

function TileRow({
    departure,
    hideSituations,
    hideTracks,
    iconColorType,
}: Props): JSX.Element {
    const icon = getIcon(departure.type, iconColorType, departure.subType)
    return (
        <TableRow>
            <DataCell className="bus-stop-row-icon">{icon}</DataCell>
            <DataCell className="bus-stop-row-route">
                {departure.route}
            </DataCell>
            <DataCell className="bus-stop-row-time">{departure.time}</DataCell>
            {!hideTracks ? (
                <DataCell className="bus-stop-row-track">
                    {departure.quay?.publicCode || '-'}
                </DataCell>
            ) : null}
            {!hideSituations ? (
                <DataCell>
                    {departure.situation ? (
                        <>
                            <SituationIcon
                                hasCancellation={departure.hasCancellation}
                            />
                            {departure.situation}
                        </>
                    ) : null}
                </DataCell>
            ) : null}
        </TableRow>
    )
}

interface Props {
    departure: LineData
    hideSituations: boolean | undefined
    hideTracks: boolean | undefined
    iconColorType: IconColorType
}

export { TileRow }
