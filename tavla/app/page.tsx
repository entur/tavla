import landingImage from 'assets/illustrations/Landing_illustration.svg'
import { Metadata } from 'next'
import Image from 'next/image'
import {
    Heading1,
    Heading2,
    Heading3,
    LeadParagraph,
    Paragraph,
} from '@entur/typography'
import { Preview } from './(admin)/components/Preview'
import { previewBoards } from '../src/Shared/utils/previewBoards'
import { Welcome } from './components/Welcome'
import { Button } from '@entur/button'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Forside | Entur Tavla',
}

function Landing() {
    return (
        <>
            <main>
                <Welcome />
                <div className="flex flex-col justify-center pb-10">
                    <div className="bg-secondary">
                        <div className="flex flex-col container py-12 gap-10 xl:flex-row">
                            <div className="flex flex-col xl:w-1/2">
                                <Heading1 margin="none">
                                    Lag en avgangstavle for
                                </Heading1>
                                <Heading1
                                    className="italic !text-highlight !font-normal"
                                    margin="bottom"
                                >
                                    kontoret
                                </Heading1>
                                <LeadParagraph className="w-full xl:w-2/3">
                                    Tavla er en gratis tjeneste som gjør det
                                    enkelt å sette opp avgangstavler for
                                    offentlig transport i hele Norge! Vis
                                    kollektivtilbudet i nærheten og hjelp folk
                                    til å planlegge sin neste kollektivreise.
                                </LeadParagraph>
                                <div className="flex md:flex-row flex-col md:items-end w-full gap-4 ">
                                    <Button
                                        variant="success"
                                        size="medium"
                                        as={Link}
                                        href="?login=create"
                                    >
                                        Opprett bruker
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="medium"
                                        as={Link}
                                        href="demo"
                                    >
                                        Test ut Tavla
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-row mx-auto items-end xl:w-1/2">
                                <Image src={landingImage} alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center py-4 container">
                        <Heading2>Hva er Tavla?</Heading2>
                        <LeadParagraph>
                            Tavla er et verktøy som hjelper deg å lage
                            avgangstavler for offentlig transport. Du kan f.eks.
                            lage avgangstavler for knutepunkter, holdeplasser
                            eller skoler, arbeidsplasser og idrettshaller.
                        </LeadParagraph>
                        <div className="flex flex-col xl:flex-row gap-4">
                            <div
                                className="xl:w-1/2 h-[60vh] overflow-y-hidden rounded-2xl"
                                data-theme="dark"
                            >
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
        </>
    )
}

export { Landing as default }
