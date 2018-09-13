import React from 'react'
import './styles.scss'
import BackButton from '../backButton/BackButton.jsx'

const Footer = ({ settingsButton, history }) => (

    <div className="footer-container">
        <BackButton className="footer-back-button" action={() => history.push('/')}/>
        <div className="settings-wrapper">
            <div className="settings--button">{settingsButton}</div>
        </div>
    </div>
)

export default Footer
