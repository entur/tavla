import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CreateBoardLocally } from './components/CreateBoardLocally'

export const metadata: Metadata = {
    title: 'Lag en tavle | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig transport',
    description: 'Opprett din egen tavle uten å logge inn.',
}

async function LagTavlePage() {
    const loggedIn = (await getUserFromSessionCookie()) !== null
    if (loggedIn) redirect('/oversikt')

    return (
        <main
            id="main-content"
            className="container flex flex-col gap-6 pb-20 pt-8"
        >
            <CreateBoardLocally />
        </main>
    )
}

export default LagTavlePage
