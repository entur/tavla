import landingImage from 'assets/illustrations/Landscape_4_withoutphone.png'
import { verifySession } from 'Admin/utils/firebase'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { TopNavigation } from './(admin)/components/TopNavigation'
import classes from './(admin)/admin.module.css'
import Image from 'next/image'
import { Heading1 } from '@entur/typography'
import { Footer } from './(admin)/components/Footer'

export const metadata: Metadata = {
    title: 'Entur Tavla',
}

async function Landing() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null
    return (
        <div className={classes.landingPage}>
            <TopNavigation loggedIn={loggedIn} />
            <div>
                <div className="pl-4">
                    <Heading1>Lag din egen avgangstavle</Heading1>
                    <Heading1 className="ml-4 text-highlight">
                        for reisende
                    </Heading1>
                </div>
                <Image src={landingImage} className="w-100 h-auto" alt="" />
            </div>
            <Footer />
        </div>
    )
}

export { Landing as default }
