import React from 'react'
import { Link } from 'react-router-dom'

import { useSettings } from '../../settings'

import Clock from '../Clock'
import { TavlaLogo } from '../../assets/icons'
import UpgradeTavlaBanner from '../../containers/DashboardWrapper/UpgradeTavlaBanner'
import { isMobileWeb } from '../../utils'

export function DashboardHeader(): JSX.Element | null {
    const settings = useSettings()[0]
    if (!settings) return null
    const { logo, logoSize, description } = settings

    const headerLogo = logo ? (
        <Link to="/">
            <img src={logo} height={logoSize} />
        </Link>
    ) : (
        <Link to="/">
            <TavlaLogo className="header__logo-wrapper__logo" />
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
            <UpgradeTavlaBanner />
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
