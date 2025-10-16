'use client'
import { TopNavigationItem } from '@entur/menu'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { Login } from './Login'
import { MobileNavbar } from './MobileNavbar'

function Navbar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    const posthog = usePostHog()

    return (
        <nav className="container flex flex-row items-center justify-between gap-3 py-8">
            <Link href="/" aria-label="Tilbake til landingssiden ">
                <Image src={TavlaLogoBlue} height={32} alt="" />
            </Link>
            <div className="flex shrink-0 flex-row items-center gap-4">
                <div className="flex flex-row sm:gap-10">
                    {loggedIn ? (
                        <TopNavigationItem
                            active={pathname?.includes('/oversikt')}
                            as={Link}
                            href="/oversikt"
                            className="hidden flex-col !text-primary md:flex"
                        >
                            Mine tavler
                        </TopNavigationItem>
                    ) : (
                        <TopNavigationItem
                            active={pathname?.includes('/demo')}
                            as={Link}
                            href="/demo"
                            onClick={() => {
                                posthog.capture('DEMO_FROM_NAV_BAR_BTN')
                            }}
                            className="hidden flex-col !text-primary md:flex"
                        >
                            Test ut Tavla
                        </TopNavigationItem>
                    )}
                    <TopNavigationItem
                        active={pathname?.includes('/hjelp')}
                        as={Link}
                        href="/hjelp"
                        className="hidden flex-col !text-primary md:flex"
                    >
                        Ofte stilte spørsmål
                    </TopNavigationItem>

                    <Login loggedIn={loggedIn} />
                </div>
                <MobileNavbar loggedIn={loggedIn} />
            </div>
        </nav>
    )
}

export { Navbar }
