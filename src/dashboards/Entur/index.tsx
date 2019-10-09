import React, { useState, useCallback } from 'react'

import { Footer, Clock } from '../../components'
import WhiteTavlaLogo from '../../assets/icons/whiteTavlaLogo/whiteTavlaLogo'
import { useBikeRentalStations, useStopPlacesWithDepartures } from '../../state'

import BikeTile from './BikeTile'
import DepartureTile from './DepartureTile'

// @ts-ignore
import errorImage from '../../assets/images/noStops.png'

import './styles.scss'

const EnturDashboard = ({ history }: Props): JSX.Element => {
    const [initialLoading] = useState<boolean>(false) // TODO: Fix loading

    const bikeRentalStations = useBikeRentalStations()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const onSettingsButtonClick = useCallback(event => {
        const path = window.location.pathname.split('@')[1]
        history.push(`/admin/@${path}`)
        event.preventDefault()
    }, [history])

    const noStops = !bikeRentalStations.length && !stopPlacesWithDepartures.length

    return (
        <div className="enturdash">
            <div className="enturdash__top">
                <WhiteTavlaLogo />
                <Clock />
            </div>
            {noStops && !initialLoading ? (
                <div className="no-stops">
                    <div className="no-stops-sheep">
                        <img src={errorImage} />
                    </div>
                </div>
            ) : (
                <div className="enturdash__tiles">
                    {
                        stopPlacesWithDepartures
                            .filter(({ departures }) => departures.length > 0)
                            .map((stop, index) => (
                                <DepartureTile
                                    key={index}
                                    stopPlaceWithDepartures={stop}
                                />
                            ))
                    }
                    {
                        bikeRentalStations && bikeRentalStations.length ? (
                            <BikeTile stations={bikeRentalStations} />
                        ) : null
                    }
                </div>
            )}
            <Footer
                className="enturdash__footer"
                history={history}
                onSettingsButtonClick={onSettingsButtonClick}
            />
        </div>
    )
}

interface Props {
    history: any,
}

export default EnturDashboard
