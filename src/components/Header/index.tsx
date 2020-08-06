import React from 'react'

import { Contrast } from '@entur/layout'

import { DashboardHeader } from './DashboardHeader'
import { DefaultHeader } from './DefaultHeader'

import './styles.scss'

function Header(): JSX.Element | null {
    const path = window.location.pathname.split('/')[1]
    const featureToggleDisplayHeader = path == '' || path == 'privacy'
    if (featureToggleDisplayHeader) return null

    const onDashboard = path == 't' || path == 'dashboard'
    const header = onDashboard ? <DashboardHeader /> : <DefaultHeader />

    return <Contrast>{header}</Contrast>
}

export default Header
