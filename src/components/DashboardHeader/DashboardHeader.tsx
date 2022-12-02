import React from 'react'
import { Link } from 'react-router-dom'
import { Contrast } from '@entur/layout'
import { useSettings } from '../../settings/SettingsProvider'
import { Clock } from '../Clock/Clock'
import { TavlaLogo } from '../../assets/icons'
import { isMobileWeb } from '../../utils/utils'
import './DashboardHeader.scss'

function DashboardHeader(): JSX.Element | null {
    const [settings] = useSettings()

    const showBoardDescription = !isMobileWeb() && settings.logoSize === '32px'

    return (
        <Contrast>
            <div className="dashboard-header">
                <div className="dashboard-header__logo-wrapper">
                    <Link to="/">
                        {settings.logo ? (
                            <img
                                src={settings.logo}
                                height={settings.logoSize}
                            />
                        ) : (
                            <TavlaLogo
                                className="dashboard-header__logo-wrapper__logo"
                                theme={settings.theme}
                            />
                        )}
                    </Link>
                    {showBoardDescription && (
                        <span className="dashboard-header__logo-wrapper__description">
                            {settings.description
                                ? settings.description
                                : 'Finn din rute på entur.no eller i Entur-appen'}
                        </span>
                    )}
                </div>
                <Clock />
            </div>
        </Contrast>
    )
}

export { DashboardHeader }
