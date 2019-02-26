import React from 'react'
import { Link } from 'react-router-dom'
import SearchPanel from '../../components/searchPanel/SearchPanel'
import { TavlaLogo } from '../../assets/icons'
import coverPhoto from '../../assets/images/cover-photo.jpg'
import './styles.scss'

const LandingPage = ({ addLocation }) => {
    return (
        <div className="landing-page-wrapper">
            <div className="title-container">
                <TavlaLogo className="title__logo"/>
                <p className='title__subtext'>Sanntidstavla du selv kan tilpasse etter dine behov.</p>
            </div>
            <div className="content-container">
                <SearchPanel handleCoordinatesSelected={addLocation}/>
                <p className="searchPanel-subtext">For å opprette en tavle trenger vi å vite hvilket område du er interessert i.<br />
                Hvis du vil, kan du lese mer om <Link to="/privacy">personvern her.</Link></p>
                <img src={coverPhoto} className="cover-photo" alt="Bilde av folk og kollektivtrafikk i landskap" />
            </div>
        </div>
    )
}


export default LandingPage
