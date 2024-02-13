import { Metadata } from 'next'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { verifySession } from 'Admin/utils/firebase'
import { TopNavigation } from './components/TopNavigation'

export const metadata: Metadata = {
    title: 'Mine organisasjoner | Entur Tavla',
}

async function AdminLayout({ children }: { children: ReactNode }) {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null
    return (
        <div className="eds-contrast">
            <TopNavigation loggedIn={loggedIn} />
            {children}
        </div>
    )
}

export default AdminLayout
