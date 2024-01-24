import landingImage from 'assets/illustrations/Landscape_4_withoutphone.png'
import { verifySession } from 'Admin/utils/firebase'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { TopNavigation } from './(admin)/components/TopNavigation'
import classes from './(admin)/admin.module.css'
import Image from 'next/image'
import { Heading1, Heading2, Heading3, LeadParagraph } from '@entur/typography'
import { Footer } from './(admin)/components/Footer'
import { TBoard } from 'types/settings'
import { Preview } from './(admin)/components/Preview'

export const metadata: Metadata = {
    title: 'Forside | Entur Tavla',
}

async function Landing() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    const previewBoard: TBoard = {
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

    return (
        <div className={classes.landingPage}>
            <TopNavigation loggedIn={loggedIn} />
            <div className="p-4">
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
                    style={{ width: '120vw', height: 'auto' }}
                    alt=""
                />
            </div>
            <div className="flexColumn justifyCenter p-4">
                <Heading2>Hva er tavla?</Heading2>
                <LeadParagraph>
                    Tavla er et verktøy som hjelper deg å lage avgagstavler for
                    offentlig transport. Du kan for eksempel lage avgagstavler
                    for knutepunkter, holdeplasser eller skoler, arbeidplasser
                    og idrettshaller.
                </LeadParagraph>
                <Preview board={previewBoard} />

                <Heading3>Tavla for de alle</Heading3>
            </div>
            <Footer />
        </div>
    )
}

export { Landing as default }
