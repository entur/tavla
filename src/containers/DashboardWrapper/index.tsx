import React, { useState, useEffect, useCallback } from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { Loading } from '@entur/component-library'

import { useCounter } from '../../utils'

// @ts-ignore
import errorImage from '../../assets/images/noStops.png'
import WhiteTavlaLogo from '../../assets/icons/whiteTavlaLogo/whiteTavlaLogo'
import { Footer, Clock } from '../../components'
import { StopPlaceWithDepartures } from '../../types'

import './styles.scss'

function DashboardWrapper(props: Props): JSX.Element {
    const secondsSinceMount = useCounter()

    const {
        className, children, history, bikeRentalStations, stopPlacesWithDepartures,
    } = props

    const onSettingsButtonClick = useCallback(event => {
        const path = window.location.pathname.split('@')[1]
        history.push(`/admin/@${path}`)
        event.preventDefault()
    }, [history])

    const [initialLoading, setInitialLoading] = useState<boolean>(true)

    useEffect(() => {
        if (initialLoading
            && (bikeRentalStations || typeof bikeRentalStations === 'undefined')
            && (stopPlacesWithDepartures || typeof stopPlacesWithDepartures === 'undefined')
        ) {
            setInitialLoading(false)
        }
    }, [bikeRentalStations, initialLoading, stopPlacesWithDepartures])

    const noData = (!stopPlacesWithDepartures || !stopPlacesWithDepartures.length) && (!bikeRentalStations || !bikeRentalStations.length)

    const renderContents = (): JSX.Element => {
        if (!noData && !initialLoading) {
            return children
        }

        if (secondsSinceMount < 2) {
            return null
        }

        if (secondsSinceMount < 5) {
            return <Loading label="Laster..." />
        }

        return <img className="no-stops" src={errorImage} />
    }

    return (
        <div className={`dashboard-wrapper ${className}`}>
            <div className="dashboard-wrapper__top">
                <WhiteTavlaLogo />
                <Clock />
            </div>
            { renderContents() }
            <Footer
                className="dashboard-wrapper__footer"
                history={history}
                onSettingsButtonClick={onSettingsButtonClick}
            />
        </div>
    )
}

interface Props {
    stopPlacesWithDepartures?: Array<StopPlaceWithDepartures> | null,
    bikeRentalStations?: Array<BikeRentalStation> | null,
    className: string,
    children: JSX.Element,
    history: any,
}

export default DashboardWrapper
