import React from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../settings/SettingsProvider'
import { Clock } from '../Clock/Clock'
import { TavlaLogo } from '../../assets/icons'
import { isMobileWeb } from '../../utils/utils'

function DashboardHeader(): JSX.Element | null {
    const [settings] = useSettings()
    if (!settings) return null
    const { logo, logoSize, description } = settings

    const headerLogo = (
        <Link to="/">
            {logo ? (
                <img src={logo} height={logoSize} />
            ) : (
                <TavlaLogo className="header__logo-wrapper__logo" />
            )}
        </Link>
    )

    const showBoardDescription = !isMobileWeb() && logoSize === '32px'

    const boardDescription = (
        <span className="header__logo-wrapper__description">
            {description
                ? description
                : 'Finn din rute på entur.no eller i Entur-appen'}
        </span>
    )

    return (
        <div>
            <div className="header">
                <div className="header__logo-wrapper">
                    {headerLogo}
                    {showBoardDescription ? boardDescription : null}
                </div>
                <Clock className="header__clock" />
            </div>
        </div>
    )
}

export { DashboardHeader }
