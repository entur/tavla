import React from 'react'
import './styles.scss'
import Arrow from '../../assets/icons/arrow.js'

const Footer = ({ settingsButton, history }) => (

    <div className="footer-container">
        <button className="back-button" onClick={() => history.push('/')}>
            <Arrow className="arrow" height={26} width={26} />
        </button>
        <div className="settings-wrapper">
            <div className="settings--button">{settingsButton}</div>
        </div>
    </div>
)

export default Footer
