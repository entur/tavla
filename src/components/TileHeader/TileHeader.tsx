import React from 'react'
import { Heading2 } from '@entur/typography'
import { WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import css from './TileHeader.module.scss'

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
        <header className={css.tileHeader}>
            <Heading2 className={css.tileHeaderHeading}>{title}</Heading2>
            <div className={css.tileHeaderIcons}>{icons}</div>
        </header>
        {!!walkInfo && (
            <div className={css.tileHeaderWalkingTime}>
                {formatWalkInfo(walkInfo)}
            </div>
        )}
    </>
)

export { TileHeader }
