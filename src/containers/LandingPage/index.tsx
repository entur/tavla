import React, { useCallback } from 'react'

import { Coordinates } from '@entur/sdk'
import { Heading1, Heading2, Paragraph, Link } from '@entur/typography'
import { Contrast } from '@entur/layout'
import { ForwardIcon } from '@entur/icons'
import { GridContainer, GridItem } from '@entur/grid'

import coverPhoto from '../../assets/images/farger.gif'
import FrontPagePhoto from '../../assets/images/front-page.jpg'

import { createSettings } from '../../services/firebase'
import { DEFAULT_SETTINGS } from '../../settings/UrlStorage'

import SearchPanel from './SearchPanel'
import TypographyCarousel from './TypographyCarousel'
import Navbar from './Navbar'
import './styles.scss'

function LandingPage({ history }: Props): JSX.Element {
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
            <Contrast>
                <Navbar />
            </Contrast>
            <div className="landing-page__content">
                <Contrast>
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
                        <GridItem small={12} medium={4}>
                            <div className="landing-page__link-wrapper">
                                <Link
                                    href="https://entur.no"
                                    className="landing-page__entur-link"
                                >
                                    Planlegg din neste reise her{' '}
                                </Link>
                                <ForwardIcon style={{ marginLeft: 5 }} />
                            </div>
                        </GridItem>
                    </GridContainer>
                </Contrast>

                <div className="landing-page__main-image-container">
                    <img
                        src={FrontPagePhoto}
                        className="landing-page__cover-photo"
                        alt="Folk og kollektivtrafikk i landskap"
                    />
                </div>

                <article>
                    <GridContainer spacing="medium">
                        <GridItem small={12} large={6}>
                            <img
                                src={coverPhoto}
                                className="landing-page__screenshot"
                                alt="Skjermbilde av Tavla"
                            />
                        </GridItem>
                        <GridItem small={12} large={6}>
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
                                bli bedre, kan du skrive til oss på Github.
                            </Paragraph>
                        </GridItem>
                    </GridContainer>
                </article>
            </div>
        </div>
    )
}

interface Props {
    history: any
}

export default LandingPage
