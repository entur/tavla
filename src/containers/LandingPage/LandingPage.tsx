import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Coordinates } from 'src/types'
import { DEFAULT_SETTINGS } from 'settings/settings'
import { createSettings } from 'settings/firebase'
import { Footer } from 'components/Footer/Footer'
import previewVideo from 'assets/videos/tavler.webm'
import { Tooltip } from '@entur/tooltip'
import { Heading1, Heading2, Paragraph, Link } from '@entur/typography'
import { Contrast } from '@entur/layout'
import { ForwardIcon } from '@entur/icons'
import { GridContainer, GridItem } from '@entur/grid'
import { Navbar } from '../Navbar/Navbar'
import { SearchPanel } from './SearchPanel/SearchPanel'
import { TypographyCarousel } from './TypographyCarousel/TypographyCarousel'
import classes from './LandingPage.module.scss'

function EnturLink(): JSX.Element {
    return (
        <div className={classes.LinkWrapper}>
            <Link href="https://entur.no" className={classes.EnturLink}>
                Planlegg din neste reise her
            </Link>
            <ForwardIcon className={classes.LinkIcon} />
        </div>
    )
}

function toggleVideo(video: HTMLVideoElement) {
    if (video.paused) video.play()
    else video.pause()
}

function LandingPage(): JSX.Element {
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

    return (
        <>
            <a
                id="skip-nav"
                className={classes.ScreenreaderText}
                href="#main-content"
            >
                Gå til hovedinnhold
            </a>
            <Helmet>
                <title>Forside - Tavla - Entur</title>
            </Helmet>
            <Navbar />
            <div className={classes.LandingPage} id="main-content">
                <Contrast className={classes.Contrast}>
                    <GridContainer
                        spacing="medium"
                        className={classes.HeaderGrid}
                    >
                        <GridItem small={12} medium={8}>
                            <header className={classes.Carousel}>
                                <Heading1 className={classes.CarouselHeader}>
                                    Lag din egen sanntidstavle for
                                </Heading1>
                                <Tooltip
                                    content="Trykk for å pause og starte animasjonen."
                                    placement="top-left"
                                >
                                    <div>
                                        <TypographyCarousel />
                                    </div>
                                </Tooltip>
                            </header>
                            <SearchPanel
                                handleCoordinatesSelected={addLocation}
                            />
                        </GridItem>
                    </GridContainer>
                </Contrast>
                <div className={classes.CoverPhotoContainer}>
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/entur-tavla-prod.appspot.com/o/public%2Fjernbanetorget.webp?alt=media"
                        className={classes.CoverPhoto}
                        alt="Folk og kollektivtrafikk i landskap"
                    />
                </div>

                <article className={classes.Article}>
                    <GridContainer spacing="extraLarge">
                        <GridItem small={12} medium={6}>
                            <Tooltip
                                content="Trykk for å pause og starte animasjonen."
                                placement="top-left"
                            >
                                <video
                                    src={previewVideo}
                                    width="800px"
                                    height="482px"
                                    className={classes.Preview}
                                    autoPlay={true}
                                    loop={true}
                                    playsInline={true}
                                    tabIndex={0}
                                    onClick={(e) =>
                                        toggleVideo(e.currentTarget)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === ' ') {
                                            e.preventDefault()
                                            toggleVideo(e.currentTarget)
                                        }
                                    }}
                                />
                            </Tooltip>
                        </GridItem>
                        <GridItem small={12} medium={6}>
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
            <Contrast>
                <Footer />
            </Contrast>
        </>
    )
}

export { LandingPage }
