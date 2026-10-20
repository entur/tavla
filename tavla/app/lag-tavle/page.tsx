import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createDraftBoard } from './actions'

export const metadata: Metadata = {
    title: 'Lag en tavle | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig transport',
    description: 'Opprett din egen tavle uten å logge inn.',
}

async function LagTavlePage() {
    const loggedIn = (await getUserFromSessionCookie()) !== null
    if (loggedIn) redirect('/oversikt')

    const bid = await createDraftBoard()
    redirect(`/lag-tavle/${bid}?new=true`)
}

export default LagTavlePage
