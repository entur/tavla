import React, { useState, useEffect, useCallback } from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { Loader } from '@entur/loader'
import { SubParagraph } from '@entur/typography'
import { Contrast } from '@entur/layout'

import { useCounter } from '../../utils'

import TavlaLogo from '../../assets/icons/tavlaLogo'
import { Clock } from '../../components'
import { StopPlaceWithDepartures } from '../../types'
import { NoStopsOnTavle } from './../Error/ErrorPages'

import BottomMenu from './BottomMenu'

import './styles.scss'
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

    const onSettingsButtonClick = useCallback(
        (event) => {
            const path = window.location.pathname.split('@')[1]
            history.push(`/admin/@${path}`)
            event.preventDefault()
        },
        [history],
    )

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

    const [{ logoSize, logo, description }] = useSettingsContext()

    return (
        <Contrast className={`dashboard-wrapper ${className}`}>
            <div className="dashboard-wrapper__top">
                <div className="dashboard-wrapper__logo-wrapper">
                    {logo ? (
                        <img src={logo} height={logoSize} />
                    ) : (
                        <TavlaLogo
                            className="dashboard-wrapper__logo"
                            height={logoSize}
                        />
                    )}
                    <SubParagraph>
                        {logoSize === '32px' &&
                            (description ||
                                'Finn din rute på entur.no eller i Entur-appen')}
                    </SubParagraph>
                </div>
                <Clock className="dashboard-wrapper__clock" />
            </div>
            {renderContents()}
            <Contrast>
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
