import React, { useState } from 'react'

import { ClosedLockIcon, UserIcon, LogOutIcon } from '@entur/icons'
import { useToast } from '@entur/alert'

import { TavlaLogo, Github } from '../../assets/icons'
import LoginModal from '../LoginModal'

import { useUser } from '../../auth'
import firebase from 'firebase'

export function DefaultHeader(): JSX.Element {
    const [displayLoginModal, setDisplayLoginModal] = useState<boolean>(false)
    const user = useUser()
    const userLoggedIn = user && !user.isAnonymous
    const { addToast } = useToast()

    const login = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ): void => {
        event.preventDefault()
        setDisplayLoginModal(true)
    }

    const logout = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ): void => {
        event.preventDefault()
        firebase.auth().signOut()
        setDisplayLoginModal(false)
        addToast({
            title: 'Logget ut',
            content: 'Du er nå logget ut av din konto.',
            variant: 'success',
        })
    }

    const loginModal = !userLoggedIn ? (
        <LoginModal
            open={displayLoginModal}
            onDismiss={(): void => setDisplayLoginModal(false)}
            loginCase="default"
        />
    ) : null

    const hideLogin = user == undefined
    const userItem = userLoggedIn ? (
        <div className="header__resources__item" onClick={logout}>
            <span className="header__resources__item__text">Logg ut</span>
            <LogOutIcon
                className="header__resources__item__icon"
                size="1.5rem"
            />
        </div>
    ) : (
        <div className="header__resources__item" onClick={login}>
            <span className="header__resources__item__text">Logg inn</span>
            <UserIcon className="header__resources__item__icon" size="1.5rem" />
        </div>
    )

    const tavlerItem = !userLoggedIn || (
        <div className="header__resources__item">
            <a href="/tavler">
                <span className="header__resources__item__text">
                    Mine tavler
                </span>
                <UserIcon
                    className="header__resources__item__icon"
                    size="1.5rem"
                />
            </a>
        </div>
    )

    return (
        <div className="header">
            {loginModal}
            <div className={`header__logo-wrapper`}>
                <a href="/">
                    <TavlaLogo className={`header__logo-wrapper__logo`} />
                </a>
            </div>
            <div className="header__resources">
                {!hideLogin ? userItem : null}
                {tavlerItem}
                <div className="header__resources__item">
                    <a href="/privacy">
                        <span className="header__resources__item__text">
                            Personvern
                        </span>
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
                        <span className="header__resources__item__text">
                            Github
                        </span>
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
