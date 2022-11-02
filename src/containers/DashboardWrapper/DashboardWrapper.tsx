import React from 'react'
import { Loader } from '@entur/loader'
import { isDarkOrDefaultTheme } from '../../utils/utils'
import { useSettings } from '../../settings/SettingsProvider'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import { StopPlaceWithDepartures } from '../../types'
import { useCounter } from '../../hooks/useCounter'
import {
    UseMobility_VehicleFragment,
    UseRentalStations_StationFragment,
} from '../../../graphql-generated/mobility-v2'
import { ThemeContrastWrapper } from '../ThemeWrapper/ThemeContrastWrapper'
import { useHandleFontScaling } from '../../hooks/useHandleFontScaling'
import { NoStopsOnTavle } from '../Error/ErrorPages'
import { BottomMenu } from './BottomMenu/BottomMenu'
import './DashboardWrapper.scss'

function DashboardWrapper(props: Props): JSX.Element {
    useHandleFontScaling()
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

    const [settings] = useSettings()

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
    bikeRentalStations?: UseRentalStations_StationFragment[] | null
    scooters?: UseMobility_VehicleFragment[] | null
    className: string
    children: JSX.Element | JSX.Element[]
}

export { DashboardWrapper }
