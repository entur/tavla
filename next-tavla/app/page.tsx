import landingImage from 'assets/illustrations/Landscape_4_withoutphone.png'
import { verifySession } from 'Admin/utils/firebase'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { TopNavigation } from './(admin)/components/TopNavigation'
import classes from './(admin)/admin.module.css'
import Image from 'next/image'
import { Heading1, Heading3, LeadParagraph } from '@entur/typography'
import { Footer } from './(admin)/components/Footer'
import { TBoard } from 'types/settings'
import { Preview } from './(admin)/components/Preview'

export const metadata: Metadata = {
    title: 'Forside | Entur Tavla',
}

async function Landing() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    const previewBoardStopPlace: TBoard = {
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
    }

    const previewBoardOperator: TBoard = {
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
    }

    const previewBoardQuay: TBoard = {
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
    }

    return (
        <div className={classes.landingPage}>
            <TopNavigation loggedIn={loggedIn} />
            <div className={classes.landingIllustration}>
                <Heading1>Lag din egen avgangstavle</Heading1>
                <Heading1 className="ml-4 text-highlight">
                    for reisende
                </Heading1>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                <Image
                    src={landingImage}
                    style={{ width: '110vw', height: 'auto' }}
                    alt=""
                />
            </div>
            <div className="flexColumn justifyCenter p-4">
                <div className="flexRow justifyCenter g-4 p-4 h-70vh hidden">
                    <Preview board={previewBoardStopPlace} />
                    <div className="w-30">
                        <Heading3>Tavla for de alle</Heading3>
                        <LeadParagraph>
                             Tavla er til for de reisende. Tavla muligjør raske
                            og effektive beslutninger for de reisende gjennom
                            pålitelig informasjon.
                        </LeadParagraph>
                    </div>
                </div>
                <div className="flexRow justifyCenter g-4 p-4 h-70vh hidden">
                    <Preview board={previewBoardOperator} />
                    <div className="w-30">
                        <Heading3>
                            Tavla - laget for og med kollektivselskaper
                        </Heading3>
                        <LeadParagraph>
                             Tavla er et digitalt produkt som er under
                            kontinuerlig utvikling i samarbeid med
                            kollektivselskapene. Med Tavla kan du enkelt
                            opprette, administrere og samarbeide om
                            avgangstavler.
                        </LeadParagraph>
                    </div>
                </div>
                <div className="flexRow justifyCenter g-4 p-4 h-70vh hidden">
                    <Preview board={previewBoardQuay} />
                    <div className="w-30">
                        <Heading3>Tavla - for knutepunkter</Heading3>
                        <LeadParagraph>
                              Tavla har støtte for alle stoppesteder i Norge. Du
                            velger selv hva slags informasjon som skal vises på
                            dine tavler.
                        </LeadParagraph>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export { Landing as default }
