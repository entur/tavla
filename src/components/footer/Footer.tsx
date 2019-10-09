import React from 'react'

import BackButton from '../backButton/BackButton'
import SettingsButton from '../settingsButton/SettingsButton'

import './styles.scss'

function Footer({ history, onSettingsButtonClick }: Props): JSX.Element {
    return (
        <footer className="footer-container">
            <BackButton className="footer-back-button" action={() => history.push('/')}/>
            <SettingsButton onClick={onSettingsButtonClick} />
        </footer>
    )
}

interface Props {
    history: any,
    onSettingsButtonClick: any,
}

export default Footer
