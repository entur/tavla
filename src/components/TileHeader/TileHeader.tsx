import React from 'react'
import { Heading2 } from '@entur/typography'
import { WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import classes from './TileHeader.module.scss'

function formatWalkInfo(walkInfo: WalkInfo) {
    if (walkInfo.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkInfo.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkInfo.walkTime / 60)} min å gå (${Math.ceil(
            walkInfo.walkDistance,
        )} m)`
    }
}

interface TileHeaderProps {
    title: string
    icons: JSX.Element | JSX.Element[]
    walkInfo?: WalkInfo
}

const TileHeader: React.FC<TileHeaderProps> = ({ title, icons, walkInfo }) => (
    <>
        <header className={classes.TileHeader}>
            <Heading2 className={classes.Heading}>{title}</Heading2>
            <div className={classes.Icons}>{icons}</div>
        </header>
        {!!walkInfo && (
            <div className={classes.WalkingTime}>
                {formatWalkInfo(walkInfo)}
            </div>
        )}
    </>
)

export { TileHeader }
