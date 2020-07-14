import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Coordinates } from '@entur/sdk'

import { Github, TavlaLogo } from '../../assets/icons'

import coverPhoto from '../../assets/images/cover-photo.jpg'

import { createSettings } from '../../services/firebase'
import { DEFAULT_SETTINGS } from '../../settings/UrlStorage'

import SearchPanel from './SearchPanel'
import './styles.scss'

const LandingPage = ({ history }: Props): JSX.Element => {
    const addLocation = useCallback(
        (position: Coordinates): void => {
            const initialSettings = {
                ...DEFAULT_SETTINGS,
                coordinates: position,
                created: new Date(),
            }

            createSettings(initialSettings).then((docRef) => {
                history.push(`/t/${docRef.id}`)
            })
        },
        [history],
    )

    return (
        <div className="landing-page">
            <header>
                <h1>
                    <TavlaLogo className="landing-page__logo" theme="light" />
                </h1>
                <h2>Sanntidstavla du selv kan tilpasse etter dine behov.</h2>
            </header>
            <div className="github-logo">
                <a href="https://github.com/entur/tavla">
                    <Github size="30px" />
                </a>
            </div>
            <div className="landing-page__content">
                <SearchPanel handleCoordinatesSelected={addLocation} />
                <p>
                    For å opprette en tavle trenger vi å vite hvilket område du
                    er interessert i.
                    <br />
                    Hvis du vil, kan du lese mer om{' '}
                    <Link to="/privacy">personvern her.</Link>
                </p>
                <p>
                    Tavlas kildekode kan du finne på{' '}
                    <a href="https://github.com/entur/tavla">GitHub</a>. Bruk
                    &quot;Watch Releases&quot; på GitHub for å følge med på
                    endringer vi gjør på Tavla.
                </p>
                <img
                    src={coverPhoto}
                    className="landing-page__cover-photo"
                    alt="Folk og kollektivtrafikk i landskap"
                />
            </div>
        </div>
    )
}

interface Props {
    history: any
}

export default LandingPage
