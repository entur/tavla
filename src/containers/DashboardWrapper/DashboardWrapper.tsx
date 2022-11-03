import React from 'react'
import classNames from 'classnames'
import { Loader } from '@entur/loader'
import { Contrast } from '@entur/layout'
import { isDarkOrDefaultTheme } from '../../utils/utils'
import { useSettings } from '../../settings/SettingsProvider'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import { Direction, StopPlaceWithDepartures } from '../../types'
import { useCounter } from '../../hooks/useCounter'
import {
    UseMobility_VehicleFragment,
    UseRentalStations_StationFragment,
} from '../../../graphql-generated/mobility-v2'
import { ThemeContrastWrapper } from '../ThemeWrapper/ThemeContrastWrapper'
import { useHandleFontScaling } from '../../hooks/useHandleFontScaling'
import { DashboardHeader } from '../../components/DashboardHeader/DashboardHeader'
import { NoStopsOnTavle } from '../Error/ErrorPages'
import { BottomMenu } from './BottomMenu/BottomMenu'
import './DashboardWrapper.scss'

interface DashboardWrapperProps {
    stopPlacesWithDepartures?: StopPlaceWithDepartures[] | null
    bikeRentalStations?: UseRentalStations_StationFragment[] | null
    scooters?: UseMobility_VehicleFragment[] | null
    className: string
    children: JSX.Element | JSX.Element[]
}

function DashboardWrapper({
    className,
    children,
    bikeRentalStations,
    stopPlacesWithDepartures,
    scooters,
}: DashboardWrapperProps): JSX.Element {
    const secondsSinceMount = useCounter()
    useHandleFontScaling()
    const [settings] = useSettings()

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

    return (
        <ThemeContrastWrapper
            className={classNames({
                rotated: settings.direction === Direction.ROTATED,
            })}
            useContrast={isDarkOrDefaultTheme(settings.theme)}
        >
            <DashboardHeader />
            <div className={classNames('dashboard-wrapper', className)}>
                {renderContents()}
                {settings.logo && (
                    <div className="dashboard-wrapper__byline">
                        Tjenesten leveres av{' '}
                        <EnturLogo
                            height="24px"
                            style={
                                isDarkOrDefaultTheme(settings.theme)
                                    ? 'white'
                                    : 'black'
                            }
                        />
                    </div>
                )}
                <Contrast>
                    <BottomMenu className="dashboard-wrapper__bottom-menu" />
                </Contrast>
            </div>
        </ThemeContrastWrapper>
    )
}

export { DashboardWrapper }
