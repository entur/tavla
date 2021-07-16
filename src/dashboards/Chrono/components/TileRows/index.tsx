import React from 'react'

import { Heading3 } from '@entur/typography'

import { DataCell, TableBody, TableRow } from '@entur/table'

import ValidationExclamation from '../../../../assets/icons/ValidationExclamation'
import ValidationError from '../../../../assets/icons/ValidationError'
import { IconColorType, LineData, TileSubLabel } from '../../../../types'

import './styles.scss'

import SituationModal from '../../../../components/SituationModal'
import { createTileSubLabel, getIcon, isMobileWeb } from '../../../../utils'
import { WalkInfoBike } from '../../../../logic/useWalkInfoBike'

const isMobile = isMobileWeb()

function formatWalkInfo(walkInfoBike: WalkInfoBike) {
    if (walkInfoBike.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(
            walkInfoBike.walkDistance,
        )} m)`
    } else {
        return `${Math.ceil(walkInfoBike.walkTime / 60)} min å gå (${Math.ceil(
            walkInfoBike.walkDistance,
        )} m)`
    }
}

export function TileRows({
    visibleDepartures,
    hideSituations,
    hideTracks,
    iconColorType,
    walkInfoBike,
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
                                <div className="tilerow__sublabel">
                                    <SubLabelIcon
                                        hideSituations={hideSituations}
                                        subLabel={subLabel}
                                    />
                                </div>
                            </DataCell>
                        ) : null}
                        {walkInfoBike ? (
                            <div className="tilerow__walking-time">
                                {formatWalkInfo(walkInfoBike)}
                            </div>
                        ) : null}
                    </TableRow>
                )
            })}
        </TableBody>
    )
}

function SubLabelIcon({
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

interface Props {
    visibleDepartures: LineData[]
    hideSituations: boolean | undefined
    hideTracks: boolean | undefined
    walkInfoBike?: WalkInfoBike
    iconColorType: IconColorType
}

export default TileRows
