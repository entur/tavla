import { OrganizationIcon, UserIcon } from '@entur/icons'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="flexRow justifyBetween alignCenter p-4">
                <Link href="/">
                    <Image src={TavlaLogo} height={32} alt="Tavla logo" />
                </Link>
                <div className="flexRow g-4">
                    <Link href="/boards" className="primaryButton">
                        <UserIcon /> Tavler
                    </Link>
                    <Link href="/organizations" className="primaryButton">
                        <OrganizationIcon />
                        Organisasjoner
                    </Link>
                </div>
            </div>
            {children}
        </>
    )
}

export default AdminLayout
