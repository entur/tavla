import {
    EmphasizedText,
    Link as EnturLink,
    Heading1,
    Heading2,
    Paragraph,
} from '@entur/typography'
import HedgehogIllustration from 'assets/illustrations/Hedgehog.png'
import { Metadata } from 'next'
import Image from 'next/image'
import { Questions } from './components/Questions'

export const metadata: Metadata = {
    title: 'Ofte stilte spørsmål | Entur Tavla',
}

function Hjelp() {
    return (
        <main>
            <div className="bg-secondary">
                <div className="flex-start container flex flex-row justify-between gap-10 pb-4 pt-12 lg:w-3/4 xl:w-1/2">
                    <div className="align-center">
                        <Heading1>Ofte stilte spørsmål</Heading1>
                        <Paragraph>
                            Nedenfor kan du finne svar på ofte stilte spørsmål.
                            Finner du ikke svaret du leter etter, ber vi deg ta
                            kontakt med oss på{' '}
                            <a
                                href="mailto:tavla@entur.org"
                                target="_blank"
                                className="underline"
                            >
                                tavla@entur.org
                            </a>{' '}
                            eller send oss en melding ved å bruke skjemaet som
                            du finner nederst i høyre hjørne.
                        </Paragraph>
                    </div>
                    <Image
                        src={HedgehogIllustration}
                        alt="Illustrasjon av et pinnsvin"
                        className="w-1/4 max-md:hidden xl:w-1/3"
                    />
                </div>
            </div>
            <div className="container flex flex-col gap-14 pb-20 pt-12 lg:w-3/4 xl:w-1/2">
                <div>
                    <Questions />
                </div>
                <div>
                    <Heading2>Guide: Hvordan komme i gang med Tavla</Heading2>
                    <Paragraph>
                        Vi har laget en guide som skal gjøre det enklere å komme
                        i gang med Tavla og hvordan du oppretter en
                        avgangstavle.
                    </Paragraph>
                    <div className="flex flex-col">
                        <iframe
                            src="https://www.kakadu.no/entur/slik-logger-du-inn-og-oppretter-en-tavle/embed"
                            loading="lazy"
                            width="100%"
                            height="580px"
                        ></iframe>
                    </div>
                </div>
                <div>
                    <Heading2>GitHub</Heading2>
                    <EmphasizedText className="italic">
                        Tavla sin kildekode er tilgjengelig for alle på{' '}
                        <EnturLink href="https://github.com/entur/tavla">
                            GitHub
                        </EnturLink>
                        . Dette gjør at du kan følge utviklingen av produktet
                        direkte og foreslå forbedringer selv.
                    </EmphasizedText>
                </div>
            </div>
        </main>
    )
}

export default Hjelp
