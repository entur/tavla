import React from 'react'
import { Heading3 } from '@entur/typography'
import { TileSubLabel } from '../../types'
import { WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import classes from './BikeTileRow.module.scss'

function formatWalkInfo(walkInfo: WalkInfo) {
    if (walkInfo.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkInfo.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkInfo.walkTime / 60)} min å gå (${Math.ceil(
            walkInfo.walkDistance,
        )} m)`
    }
}

interface BikeTileRowProps {
    label: string
    subLabels: TileSubLabel[]
    icon: JSX.Element | null
    walkInfo?: WalkInfo
}

function BikeTileRow({
    label,
    icon,
    walkInfo,
    subLabels,
}: BikeTileRowProps): JSX.Element {
    return (
        <div className={classes.BikeTileRow}>
            <div className={classes.Icon}>{icon}</div>
            <div className={classes.Texts}>
                <Heading3 className={classes.Label}>{label}</Heading3>
                {walkInfo && (
                    <div className={classes.WalkingTime}>
                        {formatWalkInfo(walkInfo)}
                    </div>
                )}
                <div className={classes.Sublabels}>
                    {subLabels.map((subLabel, index) => (
                        <div key={index}>{subLabel.time}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { BikeTileRow }
