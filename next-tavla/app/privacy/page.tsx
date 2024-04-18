import { Metadata } from 'next'
import classes from './privacy.module.css'
import { Heading1, Heading4, Paragraph } from '@entur/typography'
import doves from 'assets/illustrations/Doves.png'
import hedgehog from 'assets/illustrations/Hedgehog.png'
import squirrel from 'assets/illustrations/Squirrel.png'
import Image from 'next/image'
import { Footer } from 'app/(admin)/components/Footer'
import { TopNavigation } from 'app/(admin)/components/TopNavigation'
import { cookies } from 'next/headers'
import { ExpandableInfo } from './components/ExpandableInfo'
import { verifySession } from 'app/(admin)/utils/firebase'

export const metadata: Metadata = {
    title: 'Personvern | Entur Tavla',
}

async function Privacy() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    return (
        <>
            <TopNavigation loggedIn={loggedIn} />
            <main className="container mx-auto pb-10 min-h-full">
                <div className="flex flex-col justify-center mb-8">
                    <Heading1>Personvern</Heading1>

                    <div className="flex flex-col sm:grid sm:grid-cols-3 text-center items-center gap-4 pt-4">
                        <div className="flex flex-col justify-center items-center">
                            <Image
                                className={classes.illustration}
                                src={squirrel}
                                alt=""
                            />
                            <Heading4>Personopplysninger</Heading4>
                            <Paragraph>
                                Vi lagrer e-postadressen du oppretter din profil
                                med.
                            </Paragraph>
                        </div>
                        <div className="flex flex-col justify-center  items-center">
                            <Image
                                className={classes.illustration}
                                src={doves}
                                alt=""
                            />
                            <Heading4>Informasjonskapsler</Heading4>
                            <Paragraph>
                                Vi lagrer informasjonskapsler for å huske at du
                                er logget inn.
                            </Paragraph>
                        </div>
                        <div className="flex flex-col justify-center  items-center">
                            <Image
                                className={classes.illustration}
                                src={hedgehog}
                                alt=""
                            />
                            <Heading4>Analyseverktøy</Heading4>
                            <Paragraph>
                                Vi lagrer anonyme data om din bruk av våre
                                tjenester for å forbedre disse.
                            </Paragraph>
                        </div>
                    </div>
                </div>
                <ExpandableInfo />
            </main>
            <Footer />
        </>
    )
}

export default Privacy
