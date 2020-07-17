import React from 'react'

import { useSettings } from '../../settings'

import Clock from '../Clock'
import { TavlaLogo } from '../../assets/icons'
import UpgradeTavlaBanner from '../../containers/DashboardWrapper/UpgradeTavlaBanner'

export function DashboardHeader(): JSX.Element {
    const settings = useSettings()[0]
    if (!settings) return null
    const { logo, logoSize, description } = settings

    const headerLogo = logo ? (
        <img src={logo} height={logoSize} />
    ) : (
        <a href="/">
            <TavlaLogo className="header__logo-wrapper__logo" />
        </a>
    )

    const logoDescription =
        logoSize === '32px' &&
        (description || 'Finn din rute på entur.no eller i Entur-appen')
    const boardDescription = (
        <span className="header__logo-wrapper__description">
            {logo
                ? logoDescription
                : 'Finn din rute på entur.no eller i Entur-appen'}
        </span>
    )

    return (
        <div>
            <UpgradeTavlaBanner />
            <div className="header">
                <div className="header__logo-wrapper">
                    {headerLogo}
                    {boardDescription}
                </div>
                <Clock className="header__clock" />
            </div>
        </div>
    )
}
