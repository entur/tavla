import React from 'react'
import { Heading3 } from '@entur/typography'
import { DataCell, TableRow } from '@entur/table'
import { IconColorType, LineData } from '../../../../types'
import { SituationModal } from '../../../../components/SituationModal/SituationModal'
import { createTileSubLabel, isMobileWeb } from '../../../../utils/utils'
import { SubLabelIcon } from '../SubLabelIcon/SubLabelIcon'
import { getIcon } from '../../../../utils/icon'
import './TileRow.scss'

const isMobile = isMobileWeb()

function TileRow({
    departure,
    hideSituations,
    hideTracks,
    iconColorType,
}: Props): JSX.Element {
    const icon = getIcon(departure.type, iconColorType, departure.subType)
    return (
        <TableRow>
            <DataCell>
                <div className="tilerow__icon">{icon}</div>
            </DataCell>
            <DataCell>
                <Heading3 className="tilerow__label">
                    {departure.route}
                </Heading3>
            </DataCell>
            <DataCell>
                <div className="tilerow__sublabel">{departure.time}</div>
            </DataCell>
            {!hideTracks ? (
                <DataCell>
                    <div className="tilerow__sublabel">
                        {departure.quay?.publicCode || '-'}
                    </div>
                </DataCell>
            ) : null}
            {!hideSituations ? (
                <DataCell>
                    {isMobile && departure?.situation ? (
                        <SituationModal
                            situationMessage={departure?.situation}
                        />
                    ) : (
                        <SubLabelIcon
                            subLabel={createTileSubLabel(departure)}
                        />
                    )}
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
