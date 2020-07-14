import React, { useState, useEffect } from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { Loader } from '@entur/loader'
import { Contrast } from '@entur/layout'

import { useCounter } from '../../utils'

import EnturLogo from '../../assets/icons/enturLogo'
import { StopPlaceWithDepartures } from '../../types'
import { NoStopsOnTavle } from './../Error/ErrorPages'

import BottomMenu from './BottomMenu'

import './styles.scss'
import Header from './../../components/Header'
import { useSettingsContext } from '../../settings'

function DashboardWrapper(props: Props): JSX.Element {
    const secondsSinceMount = useCounter()

    const {
        className,
        children,
        history,
        bikeRentalStations,
        stopPlacesWithDepartures,
    } = props

    const [initialLoading, setInitialLoading] = useState<boolean>(true)

    useEffect(() => {
        if (
            initialLoading &&
            (bikeRentalStations || typeof bikeRentalStations === 'undefined') &&
            (stopPlacesWithDepartures ||
                typeof stopPlacesWithDepartures === 'undefined')
        ) {
            setInitialLoading(false)
        }
    }, [bikeRentalStations, initialLoading, stopPlacesWithDepartures])

    const noData =
        (!stopPlacesWithDepartures || !stopPlacesWithDepartures.length) &&
        (!bikeRentalStations || !bikeRentalStations.length)

    const renderContents = (): JSX.Element | JSX.Element[] => {
        if (!noData && !initialLoading) {
            return children
        }

        if (secondsSinceMount < 2) {
            return null
        }

        if (secondsSinceMount < 5) {
            return <Loader>Laster...</Loader>
        }

        return <NoStopsOnTavle />
    }

    const [{ logo }] = useSettingsContext()

    return (
        <Contrast className={`dashboard-wrapper ${className}`}>
            <Header dashboard={true} theme="dark" />
            {renderContents()}
            <Contrast>
                {logo && (
                    <div className="dashboard-wrapper__byline">
                        Tjenesten leveres av{' '}
                        <EnturLogo height="24px" style="white" />
                    </div>
                )}
                <BottomMenu
                    className="dashboard-wrapper__bottom-menu"
                    history={history}
                />
            </Contrast>
        </Contrast>
    )
}

interface Props {
    stopPlacesWithDepartures?: StopPlaceWithDepartures[] | null
    bikeRentalStations?: BikeRentalStation[] | null
    className: string
    children: JSX.Element | JSX.Element[]
    history: any
}

export default DashboardWrapper
