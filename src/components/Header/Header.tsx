import React from 'react'
import { useMatch } from 'react-router-dom'
import { Contrast } from '@entur/layout'
import { useSettings } from '../../settings/SettingsProvider'
import { Navbar } from '../../containers/Navbar/Navbar'
import { DashboardTypes } from '../../types'
import { DashboardHeader } from './DashboardHeader'
import './Header.scss'

function Header(): JSX.Element | null {
    const [settings] = useSettings()
    const isOnTavle = useMatch('/t/*')

    if (settings?.dashboard === DashboardTypes.Poster) return <></>

    return (
        <Contrast>
            {isOnTavle && <DashboardHeader />}
            {!isOnTavle && <Navbar />}
        </Contrast>
    )
}

export { Header }
