import React from 'react'
import { DataCell, TableRow } from '@entur/table'
import { IconColorType, LineData } from '../../../../types'
import { createTileSubLabel } from '../../../../utils/utils'
import { SubLabelIcon } from '../SubLabelIcon/SubLabelIcon'
import { getIcon } from '../../../../utils/icon'
import './TileRow.scss'

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
                    <SubLabelIcon subLabel={createTileSubLabel(departure)} />
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
