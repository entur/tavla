import React from 'react'

import { Contrast } from '@entur/layout'

import { DashboardHeader } from './DashboardHeader'
import { DefaultHeader } from './DefaultHeader'

import './styles.scss'

function Header({ theme }: Props): JSX.Element {
    const onDashboard =
        window.location.pathname.split('/')[1] == 't' ||
        window.location.pathname.split('/')[1] == 'dashboard'

    if (onDashboard) {
        return (
            <Contrast>
                <DashboardHeader theme={theme} />
            </Contrast>
        )
    }

    return (
        <Contrast>
            <DefaultHeader theme={theme} />
        </Contrast>
    )
}

interface Props {
    theme?: 'dark' | 'light' | 'positive' | 'negative'
}

export default Header
