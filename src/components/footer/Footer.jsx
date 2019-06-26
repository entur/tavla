import React from 'react'
import PropTypes from 'prop-types'

import BackButton from '../backButton/BackButton'
import SettingsButton from '../settingsButton/SettingsButton'

import './styles.scss'

function Footer({ history, onSettingsButtonClick }) {
    return (
        <footer className="footer-container">
            <BackButton className="footer-back-button" action={() => history.push('/')}/>
            <SettingsButton onClick={onSettingsButtonClick} />
        </footer>
    )
}

Footer.propTypes = {
    history: PropTypes.object,
    onSettingsButtonClick: PropTypes.func,
}

export default Footer
