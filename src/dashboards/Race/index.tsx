import React from 'react'
import { Heading2 } from '@entur/typography'

import {
    getIcon, getIconColor, timeUntil, useCounter,
} from '../../utils'

import { useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import './styles.scss'

const TICKS = [1, 2, 3, 5, 10, 15]

function Tick({ minutes }): JSX.Element {
    return (
        <div
            className="race__tick"
            style={{ right: minutes * 60 }}
        >
            <div style={{ width: 2, height: 16, backgroundColor: 'white' }} />
            <div>{`${minutes} min`}</div>
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
                                            <div className="race__competitor" style={{ right: waitTime + 5 * 16 }}>
                                                <Label>{ route }</Label>
                                                <Icon
                                                    key={serviceJourneyId}
                                                    style={{ right: waitTime + 5 * 16 }}
                                                    color={color}
                                                    size="large"
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                                { TICKS.map(minutes => <Tick key={minutes} minutes={minutes} />) }
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
