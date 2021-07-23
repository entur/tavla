import React from 'react'

import { Heading3 } from '@entur/typography'

import { DataCell, TableBody, TableRow } from '@entur/table'

import { IconColorType, LineData } from '../../../../types'

import './styles.scss'

import SituationModal from '../../../../components/SituationModal'
import { createTileSubLabel, getIcon, isMobileWeb } from '../../../../utils'
import SubLabelIcon from '../SubLabelIcon'

const isMobile = isMobileWeb()

export function TileRows({
    visibleDepartures,
    hideSituations,
    hideTracks,
    iconColorType,
}: Props): JSX.Element {
    return (
        <TableBody>
            {visibleDepartures.map((data) => {
                const icon = getIcon(data.type, iconColorType, data.subType)
                const subLabel = createTileSubLabel(data)
                return (
                    <TableRow key={data.id}>
                        <DataCell>
                            <div className="tilerow__icon">{icon}</div>
                        </DataCell>
                        <DataCell>
                            <Heading3 className="tilerow__label">
                                {data.route}
                            </Heading3>
                        </DataCell>
                        <DataCell>
                            <div className="tilerow__sublabel">
                                {subLabel.time}
                            </div>
                        </DataCell>
                        {!hideTracks ? (
                            <DataCell>
                                <div className="tilerow__sublabel">
                                    {data.quay?.publicCode || '-'}
                                </div>
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
                )
            })}
        </TableBody>
    )
}

/* function SubLabelIcon({
    subLabel,
    hideSituations,
}: {
    subLabel: TileSubLabel
    hideSituations?: boolean
}): JSX.Element | null {
    if (!hideSituations && subLabel?.situation)
        if (isMobile)
            return (
                <div className="tilerow__sublabel__situation">
                    <SituationModal situationMessage={subLabel.situation} />
                </div>
            )
        else
            return (
                <div className="tilerow__sublabel__situation">
                    <ValidationExclamation />
                </div>
            )

    if (subLabel.hasCancellation)
        return (
            <div className="tilerow__sublabel__cancellation">
                <ValidationError />
            </div>
        )
    return null
}
*/
interface Props {
    visibleDepartures: LineData[]
    hideSituations: boolean | undefined
    hideTracks: boolean | undefined
    iconColorType: IconColorType
}

export default TileRows
