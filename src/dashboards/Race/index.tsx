import React from 'react'
import { Heading2 } from '@entur/typography'
import { LegBone } from '@entur/component-library'
import { colors } from '@entur/tokens'

import '@entur/component-library/lib/index.css'

import {
    getIcon, getIconColor, timeUntil, useCounter,
} from '../../utils'

import { useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import './styles.scss'

const TICKS = [-2, 0, 1, 2, 3, 5, 10, 15, 20, 30]

// Use this to scale the race track.
const ZOOM = 1

function diffSincePreviousTick(minute: number): number {
    if (minute <= 0) return -1 * minute
    const index = TICKS.indexOf(minute)
    if (index < 0) return 0
    const prev = TICKS[index - 1] || 0
    return minute - prev
}

function competitorPosition(waitTime: number): number {
    const baseOffset = 25
    const negativeTickOffset = Math.abs(TICKS.filter(tick => tick < 0).reduce((a, b) => a + b, 0))
    return (waitTime * ZOOM) + (negativeTickOffset * 60 * ZOOM) + baseOffset
}

function Tick({ minutes, index }): JSX.Element {
    let label = `${minutes} min`
    let marginLeft = -30

    if (minutes === 0) {
        label = 'Nå'
        marginLeft = -20
    }

    if (minutes < 0) {
        label = ''
    }

    const width = diffSincePreviousTick(minutes) * (60 * ZOOM)
    const color = minutes < 0 ? 'grey' : colors.brand.coral

    return (
        <div style={{ minWidth: width }}>
            <LegBone
                className="race__leg-bone"
                pattern="line"
                color={color}
                showStop={index <= TICKS.length}
                showStart={index === 0}
            />
            <div className="race__tick" style={{ marginLeft }}>
                { label }
            </div>
        </div>
    )
}

function Label({ children }): JSX.Element {
    return (
        <div className="race__label">
            {children}
        </div>
    )
}

const RaceDashboard = ({ history }: Props): JSX.Element => {
    useCounter()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    return (
        <DashboardWrapper
            className="race"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="race__body">
                {
                    (stopPlacesWithDepartures || [])
                        .filter(({ departures }) => departures.length > 0)
                        .map((stop) => (
                            <div key={stop.id} className="race__stop">
                                <Heading2 margin="none" style={{ margin: 0 }}>{stop.name}</Heading2>
                                <div className="race__track">
                                    { stop.departures.map(({
                                        type, serviceJourneyId, expectedDepartureTime, route,
                                    }) => {
                                        const waitTime = timeUntil(expectedDepartureTime)
                                        const Icon = getIcon(type)
                                        const color = getIconColor(type)
                                        return (
                                            <div
                                                key={serviceJourneyId}
                                                className="race__competitor"
                                                style={{ right: competitorPosition(waitTime) }}
                                            >
                                                <Label>{ route }</Label>
                                                <Icon
                                                    color={color}
                                                    size="large"
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="race__line">
                                    { [...TICKS].reverse().map((minutes, index) => {
                                        return <Tick key={minutes} minutes={minutes} index={index} />
                                    }) }
                                </div>
                            </div>
                        ))
                }
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default RaceDashboard
