import React from 'react'
import { DataCell, TableRow } from '@entur/table'
import { IconColorType } from '../../../../types'
import { SituationInfo } from '../SituationInfo/SituationInfo'
import { Departure } from '../../../../logic/use-stop-place-with-estimated-calls/departure'
import { TransportModeIcon } from '../../../../components/TransportModeIcon/TransportModeIcon'
import './BusStopTableRow.scss'

interface Props {
    departure: Departure
    hideSituations: boolean | undefined
    hideTracks: boolean | undefined
    iconColorType: IconColorType
}

function BusStopTableRow({
    departure,
    hideSituations,
    hideTracks,
    iconColorType,
}: Props): JSX.Element {
    return (
        <TableRow>
            <DataCell className="bus-stop-row-icon">
                <TransportModeIcon
                    transportMode={departure.transportMode}
                    iconColorType={iconColorType}
                    transportSubmode={departure.transportSubmode}
                />
            </DataCell>
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

export { BusStopTableRow }
