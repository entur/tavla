import React from 'react'
import { Heading2 } from '@entur/typography'
import { WalkInfo } from '../../../../logic/use-walk-info/useWalkInfo'
import './BusStopHeader.scss'

function formatWalkInfo(walkInfo: WalkInfo) {
    if (walkInfo.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkInfo.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkInfo.walkTime / 60)} min å gå (${Math.ceil(
            walkInfo.walkDistance,
        )} m)`
    }
}

function BusStopHeader({ title, icons, walkInfo }: Props): JSX.Element {
    return (
        <>
            <header className="bus-stop-tile-header">
                <Heading2 className="bus-stop-tile-header-heading">
                    {title}
                </Heading2>
                <div className="bus-stop-tile-header-icons">{icons}</div>
            </header>
            {!!walkInfo && (
                <div className="bus-stop-tile-header-walking-time">
                    {formatWalkInfo(walkInfo)}
                </div>
            )}
        </>
    )
}

interface Props {
    title: string
    icons: JSX.Element | JSX.Element[]
    walkInfo?: WalkInfo
}

export { BusStopHeader }
