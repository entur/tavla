import React from 'react'

import { Loader } from '@entur/loader'

import { Station, Vehicle } from '@entur/sdk/lib/mobility/types'

import { useCounter, isDarkOrDefaultTheme } from '../../utils'
import { useSettingsContext } from '../../settings'

import EnturLogo from '../../assets/icons/enturLogo'

import { StopPlaceWithDepartures } from '../../types'
import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'

import { NoStopsOnTavle } from '../Error/ErrorPages'

import BottomMenu from './BottomMenu'
import './styles.scss'

function DashboardWrapper(props: Props): JSX.Element {
    const secondsSinceMount = useCounter()
    const {
        className,
        children,
        bikeRentalStations,
        stopPlacesWithDepartures,
        scooters,
    } = props

    const noData =
        !stopPlacesWithDepartures?.length &&
        !bikeRentalStations?.length &&
        !scooters?.length

    const renderContents = (): JSX.Element | JSX.Element[] | null => {
        if (!noData) {
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

    const [settings] = useSettingsContext()

    const { logo, theme } = settings || {}

    const getEnturLogo = (): JSX.Element => {
        const logoColor = isDarkOrDefaultTheme(theme) ? 'white' : 'black'
        return <EnturLogo height="24px" style={logoColor} />
    }

    return (
        <ThemeContrastWrapper useContrast={isDarkOrDefaultTheme(theme)}>
            <div className={`dashboard-wrapper ${className}`}>
                {renderContents()}
                {logo && (
                    <div className="dashboard-wrapper__byline">
                        Tjenesten leveres av {getEnturLogo()}
                    </div>
                )}
                <ThemeContrastWrapper useContrast={true}>
                    <BottomMenu className="dashboard-wrapper__bottom-menu" />
                </ThemeContrastWrapper>
            </div>
        </ThemeContrastWrapper>
    )
}

interface Props {
    stopPlacesWithDepartures?: StopPlaceWithDepartures[] | null
    bikeRentalStations?: Station[] | null
    scooters?: Vehicle[] | null
    className: string
    children: JSX.Element | JSX.Element[]
}

export default DashboardWrapper
