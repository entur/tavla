import landingImage from 'assets/illustrations/Main_Frame.png'
import { verifySession } from 'Admin/utils/firebase'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { TopNavigation } from './(admin)/components/TopNavigation'
import classes from './(admin)/admin.module.css'
import Image from 'next/image'
import {
    Heading1,
    Heading2,
    Heading3,
    LeadParagraph,
    Paragraph,
} from '@entur/typography'
import { Footer } from './(admin)/components/Footer'
import { TBoard } from 'types/settings'
import { Preview } from './(admin)/components/Preview'

export const metadata: Metadata = {
    title: 'Forside | Entur Tavla',
}

async function Landing() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    const previewBoards: TBoard[] = [
        {
            id: 'aLr7VN03RDThtjYYfd9v',
            meta: {
                fontSize: 'large',
            },
            tiles: [
                {
                    columns: ['line', 'destination', 'time', 'realtime'],
                    placeId: 'NSR:StopPlace:58260',
                    name: 'Dalsbergstien',
                    type: 'stop_place',
                    uuid: 'uoO6yA-S0ztol4auy_QSv',
                },
            ],
        },
        {
            id: 'aLr7VN03RDThtjYYfd9v',
            meta: {
                fontSize: 'large',
            },

            tiles: [
                {
                    columns: ['line', 'destination', 'time', 'realtime'],
                    placeId: 'NSR:StopPlace:58366',
                    name: 'Jernbanetorget',
                    type: 'stop_place',
                    uuid: 'uoO6yA-S0ztol4auy_QSv',
                },
            ],
        },
        {
            id: 'aLr7VN03RDThtjYYfd9v',
            meta: {
                fontSize: 'large',
            },
            tiles: [
                {
                    columns: [
                        'line',
                        'destination',
                        'time',
                        'realtime',
                        'arrivalTime',
                    ],
                    placeId: 'NSR:StopPlace:70023',
                    name: 'Harstad hurtigbåtkai',
                    type: 'stop_place',
                    uuid: 'uoO6yA-S0ztol4auy_QSv',
                },
            ],
        },
    ]

    return (
        <>
            <div className={classes.landingPage}>
                <TopNavigation loggedIn={loggedIn} />
                <div className={classes.landingContent}>
                    <div className={classes.landingHeader}>
                        <Heading1>Lag din egen avgangstavle</Heading1>
                        <Heading1 className={classes.headerHighlight}>
                            for reisende
                        </Heading1>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            marginTop: '6rem',
                        }}
                    >
                        <Image
                            src={landingImage}
                            style={{ width: '110vw', height: 'auto' }}
                            alt=""
                        />
                    </div>
                    <div className="flexColumn alignCenter p-4">
                        <div className="w-75">
                            <Heading2>Hva er tavla?</Heading2>
                            <LeadParagraph>
                                Tavla er et verktøy som hjelper deg å lage
                                avgangstavler for offentlig transport. Du kan
                                f.eks. lage avgangstavler for knutepunkter,
                                holdeplasser eller skoler, arbeidsplasser og
                                idrettshaller.  
                            </LeadParagraph>
                            <div className={classes.previewContainer}>
                                <div className="h-50vh hidden">
                                    <Preview boards={previewBoards} />
                                </div>
                                <div className={classes.content}>
                                    <Heading3>
                                        Tavla - laget for og med
                                        kollektivselskaper
                                    </Heading3>
                                    <Paragraph>
                                         Tavla er et digitalt produkt som er
                                        under kontinuerlig utvikling i samarbeid
                                        med kollektivselskapene. Med Tavla kan
                                        du enkelt opprette, administrere og
                                        samarbeide om avgangstavler.
                                    </Paragraph>
                                    <Heading3>
                                        Tavla - for knutepunkter
                                    </Heading3>
                                    <Paragraph>
                                          Tavla har støtte for alle stoppesteder
                                        i Norge. Du velger selv hva slags
                                        informasjon som skal vises på dine
                                        tavler.
                                    </Paragraph>

                                    <Heading3>Tavla for alle</Heading3>
                                    <Paragraph>
                                         Tavla er til for de reisende. Tavla
                                        muligjør raske og effektive beslutninger
                                        for de reisende gjennom pålitelig
                                        informasjon.
                                    </Paragraph>
                                </div>
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
