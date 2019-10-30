import React, { useState, useEffect } from 'react'

import { getIcon, getIconColor, timeUntil } from '../../utils'
import { useStopPlacesWithDepartures } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

// @ts-ignore
import errorImage from '../../assets/images/noStops.png'

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
    const [initialLoading] = useState<boolean>(false) // TODO: Fix loading

    const [reRender, setReRender] = useState<number>(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setReRender(reRender + 1)
        }, 1000)
        return (): void => clearInterval(interval)
    }, [reRender])

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const noStops = !stopPlacesWithDepartures.length

    return (
        <DashboardWrapper className="race" history={history}>
            {noStops && !initialLoading ? (
                <div className="no-stops">
                    <div className="no-stops-sheep">
                        <img src={errorImage} />
                    </div>
                </div>
            ) : (
                <div className="race__body">
                    {
                        stopPlacesWithDepartures
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
            )}
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default RaceDashboard
