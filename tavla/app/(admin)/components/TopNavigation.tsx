'use client'
import Link from 'next/link'
import Image from 'next/image'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import { SideNavBar } from './SideNavBar'
import { Login } from './Login'
import { TopNavigationItem } from '@entur/menu'
import { usePathname } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'

export function TopNavigation({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    const posthog = usePostHog()

    return (
        <nav className="container flex flex-row justify-between items-center py-8">
            <Link href="/" aria-label="Tilbake til landingssiden">
                <Image src={TavlaLogoBlue} height={32} alt="" />
            </Link>
            <div className="flex flex-row items-center gap-4">
                <SideNavBar loggedIn={loggedIn} />
                <div className="flex flex-row sm:gap-10">
                    {loggedIn ? (
                        <div className="flex-row hidden md:flex gap-4">
                            <TopNavigationItem
                                active={pathname?.includes('/oversikt')}
                                as={Link}
                                href="/oversikt"
                                className="!text-primary"
                            >
                                Mapper og tavler
                            </TopNavigationItem>
                        </div>
                    ) : (
                        <>
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
                            <TopNavigationItem
                                active={pathname?.includes('/help')}
                                as={Link}
                                href="/help"
                                className="!text-primary"
                            >
                                Ofte stilte spørsmål
                            </TopNavigationItem>
                        </>
                    )}
                    <Login loggedIn={loggedIn} />
                </div>
            </div>
        </nav>
    )
}
