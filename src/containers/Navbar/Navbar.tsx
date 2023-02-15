import React, { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth, useUser } from 'src/UserProvider'
import { TavlaLogo } from 'assets/icons/TavlaLogo'
import { LoginModal } from 'components/AccountModals/LoginModal/LoginModal'
import { LoginCase } from 'components/AccountModals/LoginModal/login-modal-types'
import { Theme } from 'src/types'
import { Contrast } from '@entur/layout'
import {
    ExternalIcon,
    GithubIcon,
    LogOutIcon,
    PrivacyIcon,
    UserIcon,
} from '@entur/icons'
import { TopNavigationItem } from '@entur/menu'
import { useToast } from '@entur/alert'
import classes from './Navbar.module.scss'

interface NavbarProps {
    theme?: Theme
}

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
    const location = useLocation()
    const [displayLoginModal, setDisplayLoginModal] = useState<boolean>(false)
    const user = useUser()
    const userLoggedIn = user && !user.isAnonymous
    const { addToast } = useToast()

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
            <nav className={classes.Navbar}>
                <div>
                    <Link to="/">
                        <TavlaLogo className={classes.Logo} theme={theme} />
                    </Link>
                </div>
                <div>
                    <ul className={classes.List}>
                        {userLoggedIn && (
                            <li className={classes.Element}>
                                <TopNavigationItem
                                    className={classes.Link}
                                    as={Link}
                                    to="/tavler"
                                >
                                    <span className={classes.Text}>
                                        Mine tavler
                                    </span>
                                    <UserIcon
                                        className={classes.Icon}
                                        size="20"
                                    />
                                </TopNavigationItem>
                            </li>
                        )}
                        <li className={classes.Element}>
                            <TopNavigationItem
                                className={classes.Link}
                                as={Link}
                                to="/privacy"
                                active={location.pathname === '/privacy'}
                            >
                                <span className={classes.Text}>Personvern</span>
                                <PrivacyIcon
                                    className={classes.Icon}
                                    size="20"
                                />
                            </TopNavigationItem>
                        </li>
                        <li className={classes.Element}>
                            <TopNavigationItem
                                target="_blank"
                                className={classes.Link}
                                as="a"
                                href="https://github.com/entur/tavla"
                            >
                                <span className={classes.Text}>GitHub</span>
                                <GithubIcon
                                    className={classes.Icon}
                                    size="20"
                                />
                                <ExternalIcon />
                            </TopNavigationItem>
                        </li>
                        <li className={classes.Element}>
                            {userLoggedIn ? (
                                <TopNavigationItem
                                    className={classes.Link}
                                    onClick={logout}
                                >
                                    <span className={classes.Text}>
                                        Logg ut
                                    </span>
                                    <LogOutIcon
                                        className={classes.Icon}
                                        size="20"
                                    />
                                </TopNavigationItem>
                            ) : (
                                <TopNavigationItem
                                    className={classes.Link}
                                    onClick={login}
                                >
                                    <span className={classes.Text}>
                                        Logg inn
                                    </span>
                                    <UserIcon
                                        className={classes.Icon}
                                        size="20"
                                    />
                                </TopNavigationItem>
                            )}
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
