'use client'
import { TopNavigationItem } from '@entur/menu'
import { Login } from './Login'
import Link from 'next/link'
import Image from 'next/image'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import { CreateBoard } from './CreateBoard'
import { usePathname } from 'next/navigation'

function TopNavigation({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()

    return (
        <div className="container mx-auto">
            <nav className="flex flex-row justify-between items-center py-8">
                <Link href="/" aria-label="Tilbake til landingssiden">
                    <Image src={TavlaLogoBlue} height={32} alt="" />
                </Link>
                <div className="flex flex-row items-center gap-4">
                    {loggedIn && (
                        <>
                            <CreateBoard />
                            <TopNavigationItem
                                active={pathname?.includes('/boards')}
                                as={Link}
                                href="/boards"
                            >
                                Tavler
                            </TopNavigationItem>
                            <TopNavigationItem
                                active={pathname?.includes('/organizations')}
                                as={Link}
                                href="/organizations"
                            >
                                Organisasjoner
                            </TopNavigationItem>
                        </>
                    )}
                    <Login loggedIn={loggedIn} />
                </div>
            </nav>
        </div>
    )
}

export { TopNavigation }
