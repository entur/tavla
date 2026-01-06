import { Heading1, Heading2, Paragraph } from '@entur/typography'
import doves from 'assets/illustrations/Doves.png'
import hedgehog from 'assets/illustrations/Hedgehog.png'
import squirrel from 'assets/illustrations/Squirrel.png'
import { Metadata } from 'next'
import Image from 'next/image'
import { ExpandableInfo } from './components/ExpandableInfo'

export const metadata: Metadata = {
    title: 'Personvern | Entur Tavla',
}

function Personvern() {
    return (
        <>
            <main id="main-content" className="container pb-10">
                <div className="mb-8 flex flex-col justify-center">
                    <Heading1>Personvern</Heading1>

                    <div className="flex flex-col items-center gap-4 pt-4 text-center sm:grid sm:grid-cols-3">
                        <div className="flex flex-col items-center justify-center">
                            <Image
                                className="h-40 w-auto"
                                src={squirrel}
                                alt="Illustrasjon av et ekorn som holder en nøtt"
                                aria-hidden
                            />
                            <Heading2>Personopplysninger</Heading2>
                            <Paragraph>
                                Vi lagrer e-postadressen du oppretter din profil
                                med.
                            </Paragraph>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <Image
                                className="h-40 w-auto"
                                src={doves}
                                alt="Illustrasjon av to duer som sitter mot hverandre"
                                aria-hidden
                            />
                            <Heading2>Informasjonskapsler</Heading2>
                            <Paragraph>
                                Vi lagrer informasjonskapsler for å huske at du
                                er logget inn.
                            </Paragraph>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <Image
                                className="h-40 w-auto"
                                src={hedgehog}
                                alt="Illustrasjon av et pinnsvin som sitter på bakken med et blad"
                                aria-hidden
                            />
                            <Heading2>Analyseverktøy</Heading2>
                            <Paragraph>
                                Vi lagrer anonyme data om din bruk av våre
                                tjenester for å forbedre disse.
                            </Paragraph>
                        </div>
                    </div>
                </div>
                <ExpandableInfo />
            </main>
        </>
    )
}

export default Personvern
