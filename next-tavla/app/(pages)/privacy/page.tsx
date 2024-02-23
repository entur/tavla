import { Metadata } from 'next'
import classes from './privacy.module.css'
import { Heading1, Heading4, Paragraph } from '@entur/typography'
import goat from 'assets/illustrations/Goat.png'
import hedgehog from 'assets/illustrations/Hedgehog.png'
import squirrel from 'assets/illustrations/Squirrel.png'
import Image from 'next/image'
import { Expandable } from './expandable'
import { Footer } from 'app/(admin)/components/Footer'
import { TopNavigation } from 'app/(admin)/components/TopNavigation'
import { cookies } from 'next/headers'
import { verifySession } from 'Admin/utils/firebase'

export const metadata: Metadata = {
    title: 'Personvern | Entur Tavla',
}

async function Privacy() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    return (
        <div className={classes.page}>
            <TopNavigation loggedIn={loggedIn} />
            <div className="flexColumn  alignCenter justifyCenter">
                <div className="minw-80rem p-4">
                    <Heading1>Personvern</Heading1>
                </div>
                <div className="minw-80rem flexRow justifyBetween textCenter alignCenter p-4">
                    <div className="flexColumn justifyCenter  alignCenter p-2 ">
                        <Image
                            style={{ height: '10rem', width: 'auto' }}
                            src={goat}
                            alt=""
                        />
                        <Heading4>Peronsopplysninger</Heading4>
                        <Paragraph>
                            Entur Tavla lagrer ingen personopplysninger om deg.
                            Vi lagrer ingen informasjon om deg som bruker, og vi
                            har ingen mulighet til å identifisere deg som
                            bruker.
                        </Paragraph>
                    </div>
                    <div className="flexColumn justifyCenter alignCenter p-2">
                        <Image
                            style={{ height: '10rem', width: 'auto' }}
                            src={hedgehog}
                            alt=""
                        />
                        <Heading4>Informasjonskapsler</Heading4>
                        <Paragraph>
                            Entur Tavla lagrer ingen personopplysninger om deg.
                            Vi lagrer ingen informasjon om deg som bruker, og vi
                            har ingen mulighet til å identifisere deg som
                            bruker.
                        </Paragraph>
                    </div>{' '}
                    <div className="flexColumn justifyCenter alignCenter p-2">
                        <Image
                            style={{ height: '10rem', width: 'auto' }}
                            src={squirrel}
                            alt=""
                        />
                        <Heading4>Informasjonskapsler</Heading4>
                        <Paragraph>
                            Entur Tavla lagrer ingen personopplysninger om deg.
                            Vi lagrer ingen informasjon om deg som bruker, og vi
                            har ingen mulighet til å identifisere deg som
                            bruker.
                        </Paragraph>
                    </div>
                </div>
                <div className="w-50">
                    <Expandable />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Privacy
