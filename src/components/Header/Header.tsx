import React from 'react'
import { Contrast } from '@entur/layout'
import { Navbar } from '../../containers/Navbar/Navbar'
import { DashboardHeader } from './DashboardHeader'
import './Header.scss'

function Header(): JSX.Element | null {
    const path = window.location.pathname.split('/')[1]

    const onDashboard = path == 't' || path == 'dashboard'
    const header = onDashboard ? <DashboardHeader /> : <Navbar />

    return <Contrast>{header}</Contrast>
}

export { Header }
