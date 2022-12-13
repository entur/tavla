import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Tooltip } from '@entur/tooltip'
import { Heading1, Heading2, Paragraph, Link } from '@entur/typography'
import { Contrast } from '@entur/layout'
import { ForwardIcon } from '@entur/icons'
import { GridContainer, GridItem } from '@entur/grid'
import { Coordinates } from '../../types'
import { DEFAULT_SETTINGS } from '../../settings/settings'
import { createSettings } from '../../settings/firebase'
import { Navbar } from '../Navbar/Navbar'
import { SearchPanel } from './SearchPanel/SearchPanel'
import { TypographyCarousel } from './TypographyCarousel/TypographyCarousel'
import './LandingPage.scss'
import previewScreenshot from '../../assets/images/preview-screenshot.png'

function EnturLink(): JSX.Element {
    return (
        <div className="landing-page__link-wrapper">
            <Link href="https://entur.no" className="landing-page__entur-link">
                Planlegg din neste reise her
            </Link>
            <ForwardIcon style={{ marginLeft: 5 }} />
        </div>
    )
}

function LandingPage(): JSX.Element {
    const [previewImage, setPreviewImage] = useState(
        'https://firebasestorage.googleapis.com/v0/b/entur-tavla-prod.appspot.com/o/public%2Ffarger.gif?alt=media',
    )
    const navigate = useNavigate()
    const addLocation = useCallback(
        (position: Coordinates, locationName: string): void => {
            const initialSettings = {
                ...DEFAULT_SETTINGS,
                coordinates: position,
                boardName: locationName,
                created: new Date(),
            }
            createSettings(initialSettings).then((docRef) => {
                navigate(`/t/${docRef.id}`)
            })
        },
        [navigate],
    )

    const [activeGif, setActiveGif] = useState<boolean>(true)

    return (
        <>
            <Helmet>
                <title>Forside - Tavla - Entur</title>
            </Helmet>
            <Navbar />
            <div className="landing-page">
                <div className="landing-page__content">
                    <Contrast className="landing-page__contrast">
                        <GridContainer
                            spacing="medium"
                            className="landing-page__header-grid"
                        >
                            <GridItem small={12} medium={8}>
                                <header>
                                    <div className="landing-page__carousel">
                                        <Heading1>
                                            Lag din egen sanntidstavle for
                                        </Heading1>
                                        <Tooltip
                                            content="Trykk for å pause og starte animasjonen."
                                            placement="top-left"
                                        >
                                            <div tabIndex={0}>
                                                <TypographyCarousel />
                                            </div>
                                        </Tooltip>
                                    </div>
                                </header>
                                <div className="landing-page__search-panel">
                                    <SearchPanel
                                        handleCoordinatesSelected={addLocation}
                                    />
                                </div>
                            </GridItem>
                        </GridContainer>
                    </Contrast>

                    <div className="landing-page__main-image-container">
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/entur-tavla-prod.appspot.com/o/public%2Fjernbanetorget.webp?alt=media"
                            className="landing-page__cover-photo"
                            alt="Folk og kollektivtrafikk i landskap"
                        />
                    </div>

                    <article>
                        <GridContainer spacing="extraLarge">
                            <GridItem
                                small={12}
                                large={6}
                                className="landing-page__article-grid-item"
                            >
                                <Tooltip
                                    content="Trykk for å pause og starte animasjonen."
                                    placement="top-left"
                                >
                                    <div
                                        tabIndex={0}
                                        onClick={() => {
                                            setActiveGif(!activeGif)
                                            activeGif
                                                ? setPreviewImage(
                                                      previewScreenshot,
                                                  )
                                                : setPreviewImage(
                                                      'https://firebasestorage.googleapis.com/v0/b/entur-tavla-prod.appspot.com/o/public%2Ffarger.gif?alt=media',
                                                  )
                                        }}
                                    >
                                        <img
                                            src={previewImage}
                                            className="landing-page__screenshot"
                                            alt="Skjermbilde av Tavla"
                                        />
                                    </div>
                                </Tooltip>
                            </GridItem>
                            <GridItem
                                small={12}
                                large={6}
                                className="landing-page__article-grid-item"
                            >
                                <Heading2>Avgangstavla med dine behov</Heading2>
                                <Paragraph>
                                    Tavla er en nettside som viser avgangene til
                                    all offentlig transport i Norge. Med Tavla
                                    kan du enkelt sette opp en avgangstavle fra
                                    de stoppestedene du ønsker å se, i sanntid.
                                </Paragraph>
                                <Paragraph>
                                    Tavla har flere funksjoner som gjør at den
                                    kan personifiseres etter dine behov ved å
                                    blant annet endre fargetema og laste opp din
                                    egen logo. Du kan også låse avgangstavla til
                                    din unike konto slik at bare du kan redigere
                                    på den.
                                </Paragraph>
                                <Paragraph>
                                    Vi jobber kontinuerlig med å forbedre Tavla
                                    og heve brukeropplevelsen av den. Hvis du
                                    opplever noe merkelig når du bruker Tavla
                                    eller har innspill eller ideer til hvordan
                                    tjenesten kan bli bedre, kan du skrive til
                                    oss på GitHub.
                                </Paragraph>
                            </GridItem>
                        </GridContainer>

                        <EnturLink />
                    </article>
                </div>
            </div>
        </>
    )
}

export { LandingPage }
