import React, { useState } from 'react'

import { LeadParagraph } from '@entur/typography'
import { ClosedLockIcon, UserIcon, LogOutIcon } from '@entur/icons'
import { useToast } from '@entur/alert'

import { TavlaLogo, Github } from '../../assets/icons'
import Clock from '../Clock'
import LoginModal from '../LoginModal'

import { useSettingsContext } from '../../settings'
import { useUser } from '../../auth'
import firebase from 'firebase'

import './styles.scss'

function Header({ dashboard, theme }: Props): JSX.Element {
    const [{ logo, logoSize, description }] = useSettingsContext()
    const [displayLogin, setDisplayLogin] = useState<boolean>(false)

    const userLoggedin = !useUser().isAnonymous
    const { addToast } = useToast()

    const login = (): void => {
        event.preventDefault()
        setDisplayLogin(true)
    }

    const logout = (): void => {
        event.preventDefault()
        addToast({
            title: 'Logget ut',
            content: 'Du er nå logget ut av din konto',
            variant: 'success',
        })
        firebase.auth().signOut()
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

    const loginModal = !userLoggedin ? (
        <LoginModal
            open={displayLogin}
            onDismiss={(): void => setDisplayLogin(false)}
        />
    ) : null

    const userItem = !userLoggedin ? (
        <div className="header__resources__item" onClick={login}>
            <p className="header__resources__item__text">Logg inn</p>
            <UserIcon className="header__resources__item__icon" size="1.5rem" />
        </div>
    ) : (
        <div className="header__resources__item" onClick={logout}>
            <p className="header__resources__item__text">Logg ut</p>
            <LogOutIcon
                className="header__resources__item__icon"
                size="1.5rem"
            />
        </div>
    )

    return (
        <div className="header">
            {loginModal}
            <div className={`header__logo-wrapper`}>
                <a href="/">
                    <TavlaLogo className={`header__logo`} theme={theme} />
                </a>
            </div>
            <div className="header__resources">
                {userItem}
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
