import React from 'react'

import { LeadParagraph } from '@entur/typography'
import { ClosedLockIcon, UserIcon } from '@entur/icons'

import { TavlaLogo, Github } from '../../assets/icons'
import Clock from '../Clock'

import './styles.scss'
import { useSettingsContext } from '../../settings'

function Header({ dashboard, theme }: Props): JSX.Element {
    const [{ logo, logoSize, description }] = useSettingsContext()

    const login = (): void => {
        console.log('YEET')
    }

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
                <a href="/">
                    <TavlaLogo className={`header__logo`} theme={theme} />
                </a>
            </div>
            <div className="header__resources">
                <div className="header__resources__item" onClick={login}>
                    <p className="header__resources__item__text">Logg inn</p>
                    <UserIcon
                        className="header__resources__item__icon"
                        size="1.5rem"
                    />
                </div>
                <div className="header__resources__item">
                    <a href="https://tavla.entur.no/privacy">
                        <p className="header__resources__item__text">
                            Personvern
                        </p>
                        <ClosedLockIcon
                            className="header__resources__item__icon"
                            size="1.5rem"
                        />
                    </a>
                </div>
                <div className="header__resources__item">
                    <a href="https://github.com/entur/tavla/">
                        <p className="header__resources__item__text">Github</p>
                        <Github
                            className="header__resources__item__icon"
                            size="1.5rem"
                        />
                    </a>
                </div>
            </div>
        </div>
    )
}

interface Props {
    dashboard: boolean
    theme?: 'dark' | 'light' | 'positive' | 'negative'
}

export default Header
