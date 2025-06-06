'use client'
import Link from 'next/link'
import Image from 'next/image'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import { MobileNavbar } from './MobileNavbar'
import { Login } from './Login'
import { TopNavigationItem } from '@entur/menu'
import { usePathname } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'

function Navbar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    const posthog = usePostHog()

    return (
        <nav className="container flex flex-row items-center justify-between py-8">
            <Link href="/" aria-label="Tilbake til landingssiden">
                <Image src={TavlaLogoBlue} height={32} alt="" />
            </Link>
            <div className="flex flex-row items-center gap-4">
                <MobileNavbar loggedIn={loggedIn} />
                <div className="flex flex-row sm:gap-10">
                    {loggedIn ? (
                        <div className="hidden flex-row gap-4 md:flex">
                            <TopNavigationItem
                                active={pathname?.includes('/oversikt')}
                                as={Link}
                                href="/oversikt"
                                className="!text-primary"
                            >
                                Mine tavler
                            </TopNavigationItem>
                        </div>
                    ) : (
                        <TopNavigationItem
                            active={pathname?.includes('/demo')}
                            as={Link}
                            href="/demo"
                            onClick={() => {
                                posthog.capture('DEMO_FROM_NAV_BAR_BTN')
                            }}
                            className="!text-primary"
                        >
                            Test ut Tavla
                        </TopNavigationItem>
                    )}
                    <TopNavigationItem
                        active={pathname?.includes('/help')}
                        as={Link}
                        href="/help"
                        className="!text-primary"
                    >
                        Ofte stilte spørsmål
                    </TopNavigationItem>
                    <Login loggedIn={loggedIn} />
                </div>
            </div>
        </nav>
    )
}

export { Navbar }
