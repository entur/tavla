import React, { useMemo } from 'react'
import { getIconColor, getIconColorType } from 'utils/icon'
import { useSettings } from 'settings/SettingsProvider'
import { Mode } from 'graphql-generated/journey-planner-v3'
import { colors } from '@entur/tokens'
import { LegBone } from '@entur/travel'
import { TICKS, ZOOM } from '../utils'
import classes from './Tick.module.scss'

interface TickProps {
    minutes: number
    mode: Mode
    index: number
}

const Tick: React.FC<TickProps> = ({
    minutes,
    mode,
    index,
}: TickProps): JSX.Element => {
    const [settings] = useSettings()

    const color = useMemo(() => {
        if (minutes >= 0)
            return getIconColor(mode, getIconColorType(settings.theme))
        return colors.blues.blue30
    }, [settings.theme, minutes, mode])

    const label = useMemo(() => {
        if (minutes === 0) return 'Nå'
        if (minutes < 0) return ''
        return `${minutes} min`
    }, [minutes])

    const marginLeft = useMemo(() => {
        if (minutes === 0) return -20
        return -30
    }, [minutes])

    const width = useMemo(
        () => diffSincePreviousTick(minutes) * (60 * ZOOM),
        [minutes],
    )

    return (
        <div style={{ minWidth: width }}>
            <LegBone
                className={classes.LegBone}
                direction="horizontal"
                pattern={getLegBonePattern(mode)}
                color={color}
                showStop={index <= TICKS.length}
                showStart={index === 0}
            />
            <div className={classes.Tick} style={{ marginLeft }}>
                {label}
            </div>
        </div>
    )
}

function getLegBonePattern(mode: Mode): 'line' | 'dashed' | 'dotted' | 'wave' {
    switch (mode) {
        case 'bus':
            return 'dashed'
        case 'bicycle':
            return 'dotted'
        case 'water':
            return 'wave'
        case 'metro':
        case 'rail':
        case 'tram':
        case 'air':
        default:
            return 'line'
    }
}

function diffSincePreviousTick(minute: number): number {
    if (minute <= 0) return -1 * minute
    const index = TICKS.indexOf(minute)
    if (index < 0) return 0
    const prev = TICKS[index - 1] || 0
    return minute - prev
}

export { Tick }
