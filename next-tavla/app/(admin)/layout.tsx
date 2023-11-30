import { OrganizationIcon, UserIcon } from '@entur/icons'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import classes from './admin.module.css'

export const metadata: Metadata = {
    title: 'Mine organisasjoner | Entur Tavla',
}

function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className={classes.pageContainer}>
            <div className="flexRow justifyBetween alignCenter p-4">
                <Link href="/">
                    <Image src={TavlaLogo} height={32} alt="Tavla logo" />
                </Link>
                <div className="flexRow g-4">
                    <Link
                        href="/boards"
                        className="primaryButton g-2 weight500"
                    >
                        <UserIcon /> Tavler
                    </Link>
                    <Link
                        href="/organizations"
                        className="primaryButton g-2 weight500"
                    >
                        <OrganizationIcon />
                        Organisasjoner
                    </Link>
                </div>
            </div>
            {children}
        </div>
    )
}

export default AdminLayout
