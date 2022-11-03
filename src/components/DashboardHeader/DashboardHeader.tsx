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
    const { logo } = settings

    const showBoardDescription = !isMobileWeb() && settings.logoSize === '32px'

    return (
        <Contrast>
            <div className="dashboard-header">
                <div className="dashboard-header__logo-wrapper">
                    <Link to="/">
                        {logo ? (
                            <img src={logo} height={settings.logoSize} />
                        ) : (
                            <TavlaLogo className="dashboard-header__logo-wrapper__logo" />
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
                <Clock className="dashboard-header__clock" />
            </div>
        </Contrast>
    )
}

export { DashboardHeader }
