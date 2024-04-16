import { verifySession } from './(admin)/utils/firebase'
import landingImage from 'assets/illustrations/Main_city_2.svg'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { TopNavigation } from './(admin)/components/TopNavigation'
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
import { Welcome } from './components/Welcome'

export const metadata: Metadata = {
    title: 'Forside | Entur Tavla',
}

async function Landing() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    return (
        <>
            <main className="bg-[var(--colors-brand-white)] text-[var(--colors-misc-black)]">
                <Welcome />
                <TopNavigation loggedIn={loggedIn} />
                <div className="flex flex-col justify-center p-4">
                    <div className="flex flex-col p-4">
                        <Heading1>Lag din egen avgangstavle</Heading1>
                        <Heading1 className="italic text-[var(--colors-brand-coral)] font-normal">
                            for reisende
                        </Heading1>
                    </div>

                    <Image src={landingImage} alt="" />

                    <div className="flex flex-col justify-center p-4">
                        <Heading2>Hva er Tavla?</Heading2>
                        <LeadParagraph>
                            Tavla er et verktøy som hjelper deg å lage
                            avgangstavler for offentlig transport. Du kan f.eks.
                            lage avgangstavler for knutepunkter, holdeplasser
                            eller skoler, arbeidsplasser og idrettshaller.
                        </LeadParagraph>
                        <div className="flex flex-col xl:flex-row gap-4">
                            <div className="xl:w-1/2 h-[60vh] overflow-y-hidden rounded-2xl">
                                <Preview boards={previewBoards} />
                            </div>

                            <div className="xl:w-1/2">
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
            </main>
            <Footer />
        </>
    )
}

export { Landing as default }
