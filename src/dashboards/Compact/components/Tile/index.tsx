import { Heading2 } from '@entur/typography'

import './styles.scss'
import React from 'react'

import { WalkInfo } from '../../../../logic/useWalkInfo'

import { useIsLongPressed } from '../../longPressContext'

function formatWalkInfo(walkInfo: WalkInfo) {
    if (walkInfo.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkInfo.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkInfo.walkTime / 60)} min å gå (${Math.ceil(
            walkInfo.walkDistance,
        )} m)`
    }
}

export function Tile({ title, icons, walkInfo, children }: Props): JSX.Element {
    const isPressed = useIsLongPressed()
    return (
        <div className={isPressed ? 'tile tile--start' : 'tile'}>
            <header className="tile__header">
                <Heading2>{title}</Heading2>
                <div className="tile__header-icons">{icons}</div>
            </header>
            {walkInfo ? (
                <div className="tile__walking-time">
                    {formatWalkInfo(walkInfo)}
                </div>
            ) : null}
            {children}
        </div>
    )
}

interface Props {
    title: string
    icons: JSX.Element | JSX.Element[]
    walkInfo?: WalkInfo
    children: JSX.Element[]
}

export default Tile
