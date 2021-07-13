import React from 'react'
import { Heading2 } from '@entur/typography'

import './styles.scss'
import { WalkInfo } from '../../../../logic/useWalkInfo'

function formatWalkTime(walkTime: number) {
    if (walkTime / 60 < 1) {
        return 'Mindre enn 1 min å gå'
    } else {
        return `${Math.ceil(walkTime / 60)} min å gå`
    }
}

export function Tile({ title, icons, walkInfo, children }: Props): JSX.Element {
    return (
        <div className="tile">
            <header className="tile__header">
                <Heading2>{title}</Heading2>
                <div className="tile__header-icons">{icons}</div>
            </header>
            {walkInfo ? (
                <div className="tile__walking-time">
                    {`${formatWalkTime(walkInfo.walkTime)} (${Math.ceil(
                        walkInfo.walkDistance,
                    )} m)`}
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
