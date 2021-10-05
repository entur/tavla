import React from 'react'

import { Heading3 } from '@entur/typography'

import { TileSubLabel } from '../../../../types'
import { WalkInfoBike } from '../../../../logic/useWalkInfoBike'

import './styles.scss'

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

export function TileRow({
    label,
    icon,
    walkInfoBike,
    subLabels,
}: Props): JSX.Element {
    return (
        <div className="tilerow">
            <div className="tilerow__icon">{icon}</div>
            <div className="tilerow__texts">
                <Heading3 className="tilerow__label">{label}</Heading3>
                {walkInfoBike ? (
                    <div className="tilerow__walking-time">
                        {formatWalkInfo(walkInfoBike)}
                    </div>
                ) : null}
                <div className="tilerow__sublabels">
                    {subLabels.map((subLabel, index) => (
                        <div className="tilerow__sublabel" key={index}>
                            {subLabel.time}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

interface Props {
    label: string
    subLabels: TileSubLabel[]
    icon: JSX.Element | null
    walkInfoBike?: WalkInfoBike
}

export default TileRow
