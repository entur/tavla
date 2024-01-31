import { OrganizationIcon, UserIcon } from '@entur/icons'
import { Login } from './components/Login'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import classes from './admin.module.css'
import { cookies } from 'next/headers'
import { verifySession } from 'Admin/utils/firebase'
import { IconButton } from '@entur/button'

export const metadata: Metadata = {
    title: 'Mine organisasjoner | Entur Tavla',
}

async function AdminLayout({ children }: { children: ReactNode }) {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null
    return (
        <div className="eds-contrast">
            <div className={classes.pageContainer}>
                <div className="flexRow justifyBetween alignCenter p-4">
                    <Link href="/">
                        <Image src={TavlaLogo} height={32} alt="Tavla logo" />
                    </Link>
                    <div className="flexRow g-4">
                        <IconButton
                            as={Link}
                            href="/boards"
                            className="g-2 p-2"
                        >
                            <UserIcon /> Tavler
                        </IconButton>
                        <IconButton
                            as={Link}
                            href="/organizations"
                            className="g-2 p-2"
                        >
                            <OrganizationIcon />
                            Organisasjoner
                        </IconButton>
                        <Login loggedIn={loggedIn} />
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

export default AdminLayout
