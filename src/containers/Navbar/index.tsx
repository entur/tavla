import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { signOut } from 'firebase/auth'

import { useToast } from '@entur/alert'
import { TopNavigationItem } from '@entur/menu'
import { UserIcon, LogOutIcon, GithubIcon, PrivacyIcon } from '@entur/icons'

import { useUser, auth } from '../../auth'
import { TavlaLogo } from '../../assets/icons'
import LoginModal from '../../components/Modals/LoginModal'

import './styles.scss'

export default function Navbar(): JSX.Element {
    const location = useLocation()
    const [displayLoginModal, setDisplayLoginModal] = useState<boolean>(false)
    const user = useUser()
    const userLoggedIn = user && !user.isAnonymous
    const { addToast } = useToast()

    const login = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ): void => {
        event.preventDefault()
        setDisplayLoginModal(true)
    }

    const logout = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ): void => {
        event.preventDefault()
        signOut(auth)
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

    const userItem = userLoggedIn ? (
        <li>
            <TopNavigationItem onClick={logout}>
                <span>Logg ut</span>
                <LogOutIcon size="20" />
            </TopNavigationItem>
        </li>
    ) : (
        <li>
            <TopNavigationItem onClick={login}>
                <span>Logg inn</span>
                <UserIcon size="20" />
            </TopNavigationItem>
        </li>
    )

    return (
        <nav className="navbar">
            <div className="navbar__left">
                <Link to="/">
                    <TavlaLogo className="landing-page__logo" />
                </Link>
            </div>
            <div className="navbar__right">
                <ul>
                    {location.pathname === '/tavler' ? (
                        userItem
                    ) : (
                        <li>
                            <TopNavigationItem as={Link} to="/tavler">
                                <span>Mine tavler</span>
                                <UserIcon size="20" />
                            </TopNavigationItem>
                        </li>
                    )}
                    <li>
                        <TopNavigationItem
                            as={Link}
                            to="/privacy"
                            active={location.pathname === '/privacy'}
                        >
                            <span>Personvern</span>
                            <PrivacyIcon size="20" />
                        </TopNavigationItem>
                    </li>
                    <li>
                        <TopNavigationItem
                            as="a"
                            href="https://github.com/entur/tavla"
                        >
                            <span>GitHub</span>
                            <GithubIcon size="20" />
                        </TopNavigationItem>
                    </li>
                </ul>
            </div>
            {loginModal}
        </nav>
    )
}
