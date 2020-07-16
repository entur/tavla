import React, { useState, useEffect, useCallback } from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { Loader } from '@entur/loader'
import { SubParagraph } from '@entur/typography'

import { useCounter } from '../../utils'

import TavlaLogo from '../../assets/icons/tavlaLogo'
import EnturWhite from '../../assets/icons/enturWhite'
import { Clock } from '../../components'
import { StopPlaceWithDepartures, Theme } from '../../types'
import { NoStopsOnTavle } from './../Error/ErrorPages'

import BottomMenu from './BottomMenu'

import './styles.scss'
import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'
import { useSettingsContext } from '../../settings'
import EnturBlack from '../../assets/icons/enturBlack'

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

    const [{ logoSize, logo, description, theme }] = useSettingsContext()

    return (
        <ThemeContrastWrapper
            useContrast={theme === Theme.DEFAULT || theme === Theme.DARK}
        >
            <div className={`dashboard-wrapper ${className}`}>
                <div className="dashboard-wrapper__top">
                    <div className="dashboard-wrapper__logo-wrapper">
                        {logo ? (
                            <img
                                src={logo}
                                height={logoSize}
                                className="dashboard-wrapper__logo"
                            />
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
                <ThemeContrastWrapper useContrast={true}>
                    {logo && (
                        <div className="dashboard-wrapper__byline">
                            Tjenesten leveres av{' '}
                            {theme &&
                            (theme === Theme.DEFAULT ||
                                theme === Theme.DARK) ? (
                                <EnturWhite />
                            ) : (
                                <EnturBlack />
                            )}
                        </div>
                    )}
                    <BottomMenu
                        className="dashboard-wrapper__bottom-menu"
                        history={history}
                    />
                </ThemeContrastWrapper>
            </div>
        </ThemeContrastWrapper>
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
