import React from 'react'
import { useMatch } from 'react-router-dom'
import { Contrast } from '@entur/layout'
import { Navbar } from '../../containers/Navbar/Navbar'
import { DashboardHeader } from './DashboardHeader'
import './Header.scss'

function Header(): JSX.Element | null {
    const isOnTavle = useMatch('/t/*')
    const header = isOnTavle ? <DashboardHeader /> : <Navbar />
    return <Contrast>{header}</Contrast>
}

export { Header }
