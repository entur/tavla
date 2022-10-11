import React from 'react'
import { EnturLogo } from '../../../assets/icons/EnturLogo'
import './Header.scss'

const Header = (): JSX.Element | null => (
    <div className="logo-container">
        <EnturLogo />
    </div>
)

export { Header }
