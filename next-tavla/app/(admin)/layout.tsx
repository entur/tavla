import { Metadata } from 'next'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { TopNavigation } from './components/TopNavigation'
import { verifySession } from './utils/firebase'

export const metadata: Metadata = {
    title: 'Mine organisasjoner | Entur Tavla',
}

async function AdminLayout({ children }: { children: ReactNode }) {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null
    return (
        <>
            <TopNavigation loggedIn={loggedIn} />
            <main className="container mx-auto pt-4 pb-20">{children}</main>
        </>
    )
}

export default AdminLayout
