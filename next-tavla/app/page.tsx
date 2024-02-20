import landingImage from 'assets/illustrations/Main_city_2.svg'
import { verifySession } from 'Admin/utils/firebase'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { TopNavigation } from './(admin)/components/TopNavigation'
import classes from './landing.module.css'
import Image from 'next/image'
import {
    Heading1,
    Heading2,
    Heading3,
    LeadParagraph,
    Paragraph,
} from '@entur/typography'
import { Footer } from './(admin)/components/Footer'
import { Preview } from './(admin)/components/Preview'
import { previewBoards } from '../src/Shared/utils/previewBoards'

export const metadata: Metadata = {
    title: 'Forside | Entur Tavla',
}

async function Landing() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    return (
        <>
            <div className={classes.landingPage}>
                <TopNavigation loggedIn={loggedIn} />
                <div className="flexColumn justifyCenter alignCenter hidden p-4">
                    <div className="flexColumn mt-4 p-4 minw-80rem">
                        <Heading1>Lag din egen avgangstavle</Heading1>
                        <Heading1 className={classes.headerHighlight}>
                            for reisende
                        </Heading1>
                    </div>
                    <div className="flexRow justifyCenter hidden">
                        <Image
                            src={landingImage}
                            className={classes.image}
                            alt=""
                        />
                    </div>
                    <div className="flexColumn justifyCenter p-4 minw-80rem">
                        <Heading2>Hva er tavla?</Heading2>
                        <LeadParagraph>
                            Tavla er et verktøy som hjelper deg å lage
                            avgangstavler for offentlig transport. Du kan f.eks.
                            lage avgangstavler for knutepunkter, holdeplasser
                            eller skoler, arbeidsplasser og idrettshaller.
                        </LeadParagraph>
                        <div className="mw-flex g-2 w-100">
                            <div className={`${classes.preview} mw-80rem`}>
                                <Preview boards={previewBoards} />
                            </div>
                            <div className="mw-80rem">
                                <Heading3>
                                    Tavla - laget for og med kollektivselskaper
                                </Heading3>
                                <Paragraph>
                                    Tavla er et digitalt produkt som er under
                                    kontinuerlig utvikling i samarbeid med
                                    kollektivselskapene. Med Tavla kan du enkelt
                                    opprette, administrere og samarbeide om
                                    avgangstavler.
                                </Paragraph>
                                <Heading3>Tavla - for knutepunkter</Heading3>
                                <Paragraph>
                                    Tavla har støtte for alle stoppesteder i
                                    Norge. Du velger selv hva slags informasjon
                                    som skal vises på dine tavler.
                                </Paragraph>

                                <Heading3>Tavla for alle</Heading3>
                                <Paragraph>
                                    Tavla er til for de reisende. Tavla muligjør
                                    raske og effektive beslutninger for de
                                    reisende gjennom pålitelig informasjon.
                                </Paragraph>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export { Landing as default }
