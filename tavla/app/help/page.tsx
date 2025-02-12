import {
    EmphasizedText,
    Heading1,
    Heading2,
    Paragraph,
} from '@entur/typography'
import HedgehogIllustration from 'assets/illustrations/Hedgehog.png'
import Image from 'next/image'
import { Questions } from './components/Questions'
import { Link as EnturLink } from '@entur/typography'

function Help() {
    return (
        <main>
            <div className="bg-secondary">
                <div className="flex flex-row container gap-10 lg:w-3/4 xl:w-1/2 pt-12 pb-4 justify-between flex-start">
                    <div>
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
                        className="max-md:hidden w-1/4 xl:w-1/3"
                    />
                </div>
            </div>
            <div className="container pt-12 pb-20 flex flex-col lg:w-3/4 xl:w-1/2 gap-10">
                <div>
                    <Questions />
                </div>
                <div>
                    <Heading2 href="#how-to-guides">
                        Guide: Hvordan komme i gang med Tavla
                    </Heading2>
                    <Paragraph>
                        Vi har laget en guide som skal gjøre det enklere å komme
                        i gang med Tavla og hvordan du oppretter en
                        avgangstavle.
                    </Paragraph>
                    <div className="flex flex-col">
                        <EnturLink
                            external
                            href="https://www.kakadu.no/entur/slik-oppretter-du-en-tavle"
                        >
                            Guide: Lag en avgangstavle
                        </EnturLink>
                    </div>
                </div>
                <div>
                    <Heading2>Github</Heading2>
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

export default Help
