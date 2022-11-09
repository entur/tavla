import React from 'react'
import classNames from 'classnames'
import { Heading2 } from '@entur/typography'
import { WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import { useIsLongPressed } from '../../logic/longPressContext'
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

interface TileProps {
    title: string
    icons: JSX.Element | JSX.Element[]
    walkInfo?: WalkInfo
    children: JSX.Element[] | JSX.Element
    variant: 'chrono' | 'compact' | 'bus-stop'
}

const Tile: React.FC<TileProps> = ({
    title,
    icons,
    walkInfo,
    children,
    variant,
}) => {
    const isPressed = useIsLongPressed()
    return (
        <div
            className={classNames('tile', {
                'tile--pressed': isPressed,
                'tile--chrono': variant === 'chrono',
                'tile--compact': variant === 'compact',
                'tile--bus-stop': variant === 'bus-stop',
            })}
        >
            <header className="tile__header">
                <Heading2 className="tile__heading">{title}</Heading2>
                <div className="tile__header-icons">{icons}</div>
            </header>
            {!!walkInfo && (
                <span className="tile__walking-time">
                    {formatWalkInfo(walkInfo)}
                </span>
            )}
            {children}
        </div>
    )
}

export { Tile }
