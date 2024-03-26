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
        <div className={classes.page}>
            <TopNavigation loggedIn={loggedIn} />
            <div className="flexColumn  alignCenter justifyCenter mb-4">
                <div className="minw-80rem p-4">
                    <Heading1>Personvern</Heading1>
                </div>
                <div className="minw-80rem">
                    <div className={classes.overview}>
                        <div className="flexColumn justifyCenter alignCenter p-2">
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
                        <div className="flexColumn justifyCenter alignCenter p-2">
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
                        <div className="flexColumn justifyCenter alignCenter p-2">
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
                <div className="minw-80rem">
                    <ExpandableInfo />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Privacy
