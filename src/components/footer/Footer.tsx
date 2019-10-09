import React from 'react'

import BackButton from '../backButton/BackButton'
import SettingsButton from '../settingsButton/SettingsButton'

import './styles.scss'

function Footer({ className, history, onSettingsButtonClick }: Props): JSX.Element {
    return (
        <footer className={`footer-container ${className || ''}`}>
            <BackButton className="footer-back-button" action={() => history.push('/')}/>
            <SettingsButton onClick={onSettingsButtonClick} />
        </footer>
    )
}

interface Props {
    className?: string,
    history: any,
    onSettingsButtonClick: any,
}

export default Footer
