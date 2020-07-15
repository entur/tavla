import React from 'react'

import { DashboardHeader } from './DashboardHeader'
import { DefaultHeader } from './DefaultHeader'

import './styles.scss'

function Header({ theme }: Props): JSX.Element {
    const onDashboard =
        window.location.pathname.split('/')[1] == 't' ||
        window.location.pathname.split('/')[1] == 'dashboard'

    if (onDashboard) {
        return <DashboardHeader theme={theme} />
    }

    return <DefaultHeader theme={theme} />
}

interface Props {
    theme?: 'dark' | 'light' | 'positive' | 'negative'
}

export default Header
