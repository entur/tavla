import React from 'react'
import { TavlaLogo } from '../../assets/icons'
import coverPhoto from '../../assets/bilde.png'
import './styles.scss'

const LandingPage = ({ addLocation }) => (
    <div className="landing-page-wrapper">
        <div className="title-container">
            <img src={coverPhoto} />
            <TavlaLogo />
            <p>Velkommen til Entur Tavla, sanntidstavla du kan tilpasse etter dine behov.</p>
        </div>
        <div className="round-shape"/>
        <div className="content-container">
            <button className="landing-button" onClick={addLocation}>Finn min posisjon</button>
            <p>For å kunne opprette en tavle der du er, trenger vi din lokasjon</p>
        </div>
    </div>
)

export default LandingPage
