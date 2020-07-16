import React, { useState } from 'react'

import { ClosedLockIcon, UserIcon, LogOutIcon } from '@entur/icons'
import { useToast } from '@entur/alert'

import { TavlaLogo, Github } from '../../assets/icons'
import LoginModal from '../LoginModal'

import { useUser } from '../../auth'
import firebase from 'firebase'

export function DefaultHeader({ theme }: Props): JSX.Element {
    const [displayLoginModal, setDisplayLoginModal] = useState<boolean>(false)
    const user = useUser()
    const userLoggedin = user && !user.isAnonymous
    const { addToast } = useToast()

    const login = (): void => {
        event.preventDefault()
        setDisplayLoginModal(true)
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

    const loginModal = !userLoggedin ? (
        <LoginModal
            open={displayLoginModal}
            onDismiss={(): void => setDisplayLoginModal(false)}
            loginDescription="Logg inn på for å se en oversikt over dine tavler og for muligheten til å låse nye tavler til din konto."
        />
    ) : null

    const hideLogin = user == undefined
    const userItem = userLoggedin ? (
        <div className="header__resources__item" onClick={logout}>
            <p className="header__resources__item__text">Logg ut</p>
            <LogOutIcon
                className="header__resources__item__icon"
                size="1.5rem"
            />
        </div>
    ) : (
        <div className="header__resources__item" onClick={login}>
            <p className="header__resources__item__text">Logg inn</p>
            <UserIcon className="header__resources__item__icon" size="1.5rem" />
        </div>
    )

    return (
        <div className="header">
            {loginModal}
            <div className={`header__logo-wrapper`}>
                <a href="/">
                    <TavlaLogo
                        className={`header__logo-wrapper__logo`}
                        theme={theme}
                    />
                </a>
            </div>
            <div className="header__resources">
                {!hideLogin ? userItem : null}
                <div className="header__resources__item">
                    <a href="/privacy">
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
                    <a
                        href="https://github.com/entur/tavla/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
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
    theme?: 'dark' | 'light' | 'positive' | 'negative'
}
