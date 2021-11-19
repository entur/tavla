import React, { useCallback } from 'react'

import { useHistory } from 'react-router'

import { Coordinates } from '@entur/sdk'
import { Heading1, Heading2, Paragraph, Link } from '@entur/typography'
import { Contrast } from '@entur/layout'
import { ForwardIcon } from '@entur/icons'
import { GridContainer, GridItem } from '@entur/grid'

import { createSettings } from '../../services/firebase'
import { DEFAULT_SETTINGS } from '../../settings/UrlStorage'

import SearchPanel from './SearchPanel'
import TypographyCarousel from './TypographyCarousel'
import './styles.scss'

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
    const history = useHistory()
    const addLocation = useCallback(
        (position: Coordinates, locationName: string): void => {
            const initialSettings = {
                ...DEFAULT_SETTINGS,
                coordinates: position,
                boardName: locationName,
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
                                    <TypographyCarousel />
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
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/entur-tavla-prod.appspot.com/o/public%2Ffarger.gif?alt=media"
                                className="landing-page__screenshot"
                                alt="Skjermbilde av Tavla"
                            />
                        </GridItem>
                        <GridItem
                            small={12}
                            large={6}
                            className="landing-page__article-grid-item"
                        >
                            <Heading2>Avgangstavla med dine behov</Heading2>
                            <Paragraph>
                                Tavla er en nettside som viser avgangene til all
                                offentlig transport i Norge. Med Tavla kan du
                                enkelt sette opp en avgangstavle fra de
                                stoppestedene du ønsker å se, i sanntid.
                            </Paragraph>
                            <Paragraph>
                                Tavla har flere funksjoner som gjør at den kan
                                personifiseres etter dine behov ved å blant
                                annet endre fargetema og laste opp din egen
                                logo. Du kan også låse avgangstavla til din
                                unike konto slik at bare du kan redigere på den.
                            </Paragraph>
                            <Paragraph>
                                Vi jobber kontinuerlig med å forbedre Tavla og
                                heve brukeropplevelsen av den. Hvis du opplever
                                noe merkelig når du bruker Tavla eller har
                                innspill eller ideer til hvordan tjenesten kan
                                bli bedre, kan du skrive til oss på GitHub.
                            </Paragraph>
                        </GridItem>
                    </GridContainer>
                    <EnturLink />
                </article>
            </div>
        </div>
    )
}

export default LandingPage
