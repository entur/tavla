import React from 'react'

import { Heading2 } from '@entur/typography'

import { WalkInfo } from '../../../../logic/useWalkInfo'
import { useIsLongPressed } from '../../../../logic/longPressContext'

import './Tile.scss'

function formatWalkInfo(walkInfo: WalkInfo) {
    if (walkInfo.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkInfo.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkInfo.walkTime / 60)} min å gå (${Math.ceil(
            walkInfo.walkDistance,
        )} m)`
    }
}

function Tile({ title, icons, walkInfo, children }: Props): JSX.Element {
    const isPressed = useIsLongPressed()
    return (
        <div className={isPressed ? 'tile tile--pressed' : 'tile'}>
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
    children: JSX.Element[] | JSX.Element
}

export { Tile }
