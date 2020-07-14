import React from 'react'

import { LeadParagraph } from '@entur/typography'

import { TavlaLogo } from '../../assets/icons'
import Clock from '../Clock'

import './styles.scss'
import { useSettingsContext } from '../../settings'

function Header({ dashboard, theme }: Props): JSX.Element {
    const [{ logo, logoSize, description }] = useSettingsContext()

    if (dashboard) {
        const headerLogo = logo ? (
            <img src={logo} height={logoSize} />
        ) : (
            <TavlaLogo className={`header__logo`} theme="dark" />
        )

        return (
            <div className="header">
                <div className={`header__logo-wrapper`}>
                    {headerLogo}
                    <LeadParagraph className="header__logo-wrapper__description">
                        {logoSize === '32px' &&
                            (description ||
                                'Finn din rute på entur.no eller i Entur-appen')}
                    </LeadParagraph>
                </div>
                <Clock className={`header__clock`} />
            </div>
        )
    }

    return (
        <div className="header">
            <div className={`header__logo-wrapper`}>
                <TavlaLogo className={`header__logo`} theme={theme} />
            </div>
        </div>
    )
}

interface Props {
    dashboard: boolean
    theme?: 'dark' | 'light' | 'positive' | 'negative'
}

export default Header
