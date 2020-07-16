import React from 'react'

import { Paragraph } from '@entur/typography'

import { useSettings } from '../../settings'

import Clock from '../Clock'
import { TavlaLogo } from '../../assets/icons'

export function DashboardHeader({ theme }: Props): JSX.Element {
    const settings = useSettings()[0]
    if (!settings) return null
    const { logo, logoSize, description } = settings

    const headerLogo = logo ? (
        <img src={logo} height={logoSize} />
    ) : (
        <a href="/">
            <TavlaLogo className={`header__logo-wrapper__logo`} theme={theme} />
        </a>
    )

    return (
        <div className="header">
            <div className={`header__logo-wrapper`}>
                {headerLogo}
                <Paragraph className="header__logo-wrapper__description">
                    {logoSize === '32px' &&
                        (description ||
                            'Finn din rute på entur.no eller i Entur-appen')}
                </Paragraph>
            </div>
            <Clock className={`header__clock`} />
        </div>
    )
}

interface Props {
    theme?: 'dark' | 'light' | 'positive' | 'negative'
}
