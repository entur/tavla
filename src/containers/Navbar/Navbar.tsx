import React, { useCallback, useState } from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useToast } from '@entur/alert'
import { TopNavigationItem } from '@entur/menu'
import { GithubIcon, LogOutIcon, PrivacyIcon, UserIcon } from '@entur/icons'
import { Contrast } from '@entur/layout'
import { auth, useUser } from '../../UserProvider'
import { TavlaLogo } from '../../assets/icons'
import { LoginModal } from '../../components/LoginModal/LoginModal'
import { LoginCase } from '../../components/LoginModal/login-modal-types'
import { Theme } from '../../types'
import './Navbar.scss'

interface NavbarProps {
    theme?: Theme
}

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
    const location = useLocation()
    const [displayLoginModal, setDisplayLoginModal] = useState<boolean>(false)
    const user = useUser()
    const userLoggedIn = user && !user.isAnonymous
    const { addToast } = useToast()
    const onMineTavler = useMatch('/tavler')

    const login = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
            event.preventDefault()
            setDisplayLoginModal(true)
        },
        [],
    )

    const logout = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
            event.preventDefault()
            signOut(auth)
            setDisplayLoginModal(false)
            addToast({
                title: 'Logget ut',
                content: 'Du er nå logget ut av din konto.',
                variant: 'success',
            })
        },
        [addToast],
    )

    return (
        <Contrast>
            <nav className="navbar">
                <div className="navbar__left">
                    <Link to="/">
                        <TavlaLogo
                            className="landing-page__logo"
                            theme={theme}
                        />
                    </Link>
                </div>
                <div className="navbar__right">
                    <ul>
                        {onMineTavler && userLoggedIn && (
                            <li>
                                <TopNavigationItem
                                    onClick={logout}
                                    href="/tavler"
                                >
                                    <span>Logg ut</span>
                                    <LogOutIcon size="20" />
                                </TopNavigationItem>
                            </li>
                        )}
                        {onMineTavler && !userLoggedIn && (
                            <li>
                                <TopNavigationItem onClick={login}>
                                    <span>Logg inn</span>
                                    <UserIcon size="20" />
                                </TopNavigationItem>
                            </li>
                        )}
                        {!onMineTavler && (
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
                {!userLoggedIn && (
                    <LoginModal
                        open={displayLoginModal}
                        onDismiss={(): void => setDisplayLoginModal(false)}
                        loginCase={LoginCase.default}
                    />
                )}
            </nav>
        </Contrast>
    )
}

export { Navbar }
