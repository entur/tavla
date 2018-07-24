import React from 'react'
import SearchPanel from '../../components/searchPanel/SearchPanel'
import { TavlaLogo } from '../../assets/icons'
import coverPhoto from '../../assets/bilde.png'
import './styles.scss'

const LandingPage = ({ addLocation }) => {
    return (
        <div className="landing-page-wrapper">
            <div className="title-container">
                <img src={coverPhoto} />
                <TavlaLogo />
                <p>Velkommen til Entur Tavla, sanntidstavla du kan tilpasse etter dine behov.</p>
            </div>
            <div className="round-shape"/>
            <div className="content-container">
                <SearchPanel handleCoordinatesSelected={addLocation}/>
                <p>For å kunne opprette en tavle, trenger vi å vite hvilket område du er interessert i.</p>
            </div>
        </div>
    )
}


export default LandingPage
