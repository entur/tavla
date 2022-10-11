import React from 'react'
import { Heading3 } from '@entur/typography'
import { TileSubLabel } from '../../../../types'
import { WalkInfo } from '../../../../logic/useWalkInfo'
import './TileRow.scss'

function formatWalkInfo(walkInfo: WalkInfo) {
    if (walkInfo.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkInfo.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkInfo.walkTime / 60)} min å gå (${Math.ceil(
            walkInfo.walkDistance,
        )} m)`
    }
}

function TileRow({ label, icon, walkInfo, subLabels }: Props): JSX.Element {
    return (
        <div className="tilerow">
            <div className="tilerow__icon">{icon}</div>
            <div className="tilerow__texts">
                <Heading3 className="tilerow__label">{label}</Heading3>
                {walkInfo ? (
                    <div className="tilerow__walking-time">
                        {formatWalkInfo(walkInfo)}
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
    walkInfo?: WalkInfo
}

export { TileRow }
