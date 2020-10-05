import React from 'react'
import { colors } from '@entur/tokens'
import { getIcon, getIconColor } from '../../../utils'

import './styles.scss'
import { IconColorType, StopPlaceWithDepartures } from '../../../types'

const StopPlaceTag = ({ stopPlace, walkTimes }: Props): JSX.Element => {
    const uniqueTypes = [
        ...new Set(stopPlace.departures.map((departure) => departure.type)),
    ]

    const icons = uniqueTypes.map((type) => ({
        icon: getIcon(type, undefined, undefined, colors.brand.white),
        color: getIconColor(type, IconColorType.DEFAULT, undefined),
    }))

    const travelTimeForStopPlace =
        walkTimes?.find(
            (walkTime) => (walkTime.stopId === stopPlace.id && walkTime.walkTime !== undefined)
        )
        
    return (
        <div className="stopplace-tag">
            <div className="stopplace-tag__icon-row">
                {icons.map((icon, i) => (
                    <div
                        key={i}
                        className="stopplace-tag__icon-row__icon"
                        style={{ backgroundColor: icon.color }}
                    >
                        {icon.icon}
                    </div>
                ))}
            </div>
            <div className="stopplace-tag__stopplace">{stopPlace.name}</div>
            <div className="stopplace-tag__walking-distance">
                {travelTimeForStopPlace
                    ? `${Math.ceil(
                          (travelTimeForStopPlace.walkTime) / 60,
                      )} min å gå`
                    : ''}
            </div>
        </div>
    )
}

interface Props {
    stopPlace: StopPlaceWithDepartures
    walkTimes: { stopId: string; walkTime: number; }[] | null
}

export default StopPlaceTag
