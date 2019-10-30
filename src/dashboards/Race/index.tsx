import React from 'react'

import {
    getIcon, getIconColor, timeUntil, useCounter,
} from '../../utils'

import { useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import './styles.scss'

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
                                <h2>{stop.name}</h2>
                                <div className="race__track">
                                    { stop.departures.map(({
                                        type, serviceJourneyId, expectedDepartureTime,
                                    }) => {
                                        const waitTime = timeUntil(expectedDepartureTime)
                                        const Icon = getIcon(type)
                                        const color = getIconColor(type)
                                        return (
                                            <Icon
                                                key={serviceJourneyId}
                                                className="race__competitor"
                                                style={{ width: 100, right: waitTime + 5 * 16, marginBottom: 6 }}
                                                color={color}
                                                size="large"
                                            />
                                        )
                                    })}
                                </div>
                                { [1, 2, 3, 5, 10, 15].map(minutes => <Tick key={minutes} minutes={minutes} />) }
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
