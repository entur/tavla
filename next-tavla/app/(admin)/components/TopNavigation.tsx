'use client'
import Link from 'next/link'
import Image from 'next/image'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import { SideNavBar } from './SideNavBar'
import { HorizontalNavBar } from './HorizontalNavBar'
import { Login } from './Login'

function TopNavigation({ loggedIn }: { loggedIn: boolean }) {
    return (
        <nav className="container mx-auto flex flex-row justify-between items-center py-8">
            <Link href="/" aria-label="Tilbake til landingssiden">
                <Image src={TavlaLogoBlue} height={32} alt="" />
            </Link>
            <div className="flex flex-row items-center">
                <SideNavBar loggedIn={loggedIn} />
                <HorizontalNavBar loggedIn={loggedIn} />
                <Login loggedIn={loggedIn} />
            </div>
        </nav>
    )
}

export { TopNavigation }
