import React from 'react'

import { LeadParagraph } from '@entur/typography'

import { TavlaLogo } from '../../assets/icons'
import Clock from '../Clock'

import './styles.scss'

function Header({ dashboard, theme }: Props): JSX.Element {
    if (dashboard) {
        return (
            <div className="header">
                <div className={`header__logo-wrapper`}>
                    <TavlaLogo className={`header__logo`} theme={theme} />
                    <LeadParagraph>
                        Finn din reiserute på entur.no eller i Entur-appen
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
