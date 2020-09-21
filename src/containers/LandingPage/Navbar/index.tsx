import React from 'react'
import { Link } from 'react-router-dom'

import { TopNavigationItem } from '@entur/menu'
import { ClosedLockIcon } from '@entur/icons'

import { Github, TavlaLogo } from '../../../assets/icons'

import './styles.scss'

export default function Navbar(): JSX.Element {
    return (
        <nav className="navbar">
            <div className="navbar__left">
                <TavlaLogo className="landing-page__logo" forceColor="white" />
            </div>
            <div className="navbar__right">
                <ul>
                    <li>
                        <TopNavigationItem as={Link} to="/privacy">
                            <span>Personvern</span>
                            <ClosedLockIcon />
                        </TopNavigationItem>
                    </li>
                    <li>
                        <TopNavigationItem
                            as="a"
                            href="https://github.com/entur/tavla"
                        >
                            <span>GitHub</span>
                            <Github size="16px" />
                        </TopNavigationItem>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
