import React from 'react'
import SearchPanel from '../../components/searchPanel/SearchPanel'
import { TavlaLogo } from '../../assets/icons'
import coverPhoto from '../../assets/images/cover-photo.jpg'
import './styles.scss'

const LandingPage = ({ addLocation, goToPrivacy }) => {
    return (
        <div className="landing-page-wrapper">
            <div className="title-container">
                <TavlaLogo className="title__logo"/>
                <p className='title__subtext'>Sanntidstavla du selv kan tilpasse etter dine behov.</p>
            </div>
            <div className="content-container">
                <SearchPanel handleCoordinatesSelected={addLocation}/>
                <p className="searchPanel-subtext">For å opprette en tavle trenger vi å vite hvilket område du er interessert i.</p>
                <img src={coverPhoto} className="cover-photo"/>
            </div>

            <button className="privacy-button" onClick={ goToPrivacy }>Personvern</button>
        </div>
    )
}


export default LandingPage
