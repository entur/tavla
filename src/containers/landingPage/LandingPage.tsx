import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Coordinates } from '@entur/sdk'

import SearchPanel from '../../components/searchPanel/SearchPanel'
import { TavlaLogo } from '../../assets/icons'
// @ts-ignore
import coverPhoto from '../../assets/images/cover-photo.jpg'

import './styles.scss'

const LandingPage = ({ history }: Props): JSX.Element => {
    const addLocation = useCallback((position: Coordinates): void => {
        const pos = `${position.latitude},${position.longitude}`.split('.').join('-')
        history.push(`/dashboard/@${pos}/`)
    }, [history])

    return (
        <div className="landing-page-wrapper">
            <div className="title-container">
                <TavlaLogo />
                <p className='title__subtext'>Sanntidstavla du selv kan tilpasse etter dine behov.</p>
            </div>
            <div className="content-container">
                <SearchPanel handleCoordinatesSelected={addLocation}/>
                <p className="searchPanel-subtext">
                    For å opprette en tavle trenger vi å vite hvilket område du er interessert i.<br />
                    Hvis du vil, kan du lese mer om <Link to="/privacy">personvern her.</Link>
                </p>
                <p className="searchPanel-subtext">
                    Tavlas kildekode kan du finne på <a href="https://github.com/entur/tavla">GitHub</a>.
                    Bruk "Watch Releases" på GitHub for å følge med på endringer vi gjør på Tavla.
                </p>
                <img src={coverPhoto} className="cover-photo" alt="Bilde av folk og kollektivtrafikk i landskap" />
            </div>
        </div>
    )
}

interface Props {
    history: any,
}

export default LandingPage
