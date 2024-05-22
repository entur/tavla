'use client'
import Link from 'next/link'
import Image from 'next/image'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import { SideNavBar } from './SideNavBar'
import { useBreakpoint } from 'hooks/useBreakpoint'
import { HorizontalNavBar } from './HorizontalNavBar'

function TopNavigation({ loggedIn }: { loggedIn: boolean }) {
    const isMobileView = useBreakpoint('(max-width: 769px)')

    return (
        <div className="container mx-auto">
            <nav className="flex flex-row justify-between items-center py-8">
                <Link href="/" aria-label="Tilbake til landingssiden">
                    <Image src={TavlaLogoBlue} height={32} alt="" />
                </Link>
                <div className="flex flex-row items-center gap-4 ">
                    {isMobileView && loggedIn ? (
                        <SideNavBar />
                    ) : (
                        <HorizontalNavBar loggedIn={loggedIn} />
                    )}
                </div>
            </nav>
        </div>
    )
}

export { TopNavigation }
