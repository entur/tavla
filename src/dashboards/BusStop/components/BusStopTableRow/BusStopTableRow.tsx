import React from 'react'
import { DataCell, TableRow } from '@entur/table'
import { IconColorType, LineData } from '../../../../types'
import { SituationInfo } from '../SituationInfo/SituationInfo'
import { getIcon } from '../../../../utils/icon'
import './BusStopTableRow.scss'

function BusStopTableRow({
    departure,
    hideSituations,
    hideTracks,
    iconColorType,
}: Props): JSX.Element {
    const transportIcon = getIcon(
        departure.type,
        iconColorType,
        departure.subType,
    )

    return (
        <TableRow>
            <DataCell className="bus-stop-row-icon">{transportIcon}</DataCell>
            <DataCell className="bus-stop-row-route">
                {departure.route}
            </DataCell>
            <DataCell className="bus-stop-row-time">{departure.time}</DataCell>
            {!hideTracks && (
                <DataCell className="bus-stop-row-track">
                    {departure.quay?.publicCode || '-'}
                </DataCell>
            )}
            {!hideSituations && (
                <DataCell>
                    <SituationInfo departure={departure} />
                </DataCell>
            )}
        </TableRow>
    )
}

interface Props {
    departure: LineData
    hideSituations: boolean | undefined
    hideTracks: boolean | undefined
    iconColorType: IconColorType
}

export { BusStopTableRow }
