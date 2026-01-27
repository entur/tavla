'use client'
import { TopNavigationItem } from '@entur/menu'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Login } from './Login'
import { MobileNavbar } from './MobileNavbar'

function Navbar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    const posthog = usePosthogTracking()

    return (
        <nav className="container flex flex-row items-center justify-between gap-3 py-8">
            <Link
                href="/"
                onClick={() =>
                    posthog.capture('go_to_home_page', { location: 'nav_bar' })
                }
            >
                <Image
                    src={TavlaLogoBlue}
                    height={32}
                    alt="Gå tilbake til landingssiden"
                />
            </Link>
            <div className="flex shrink-0 flex-row items-center gap-4">
                <div className="flex flex-row sm:gap-10">
                    {loggedIn ? (
                        <TopNavigationItem
                            active={pathname?.includes('/oversikt')}
                            as={Link}
                            href="/oversikt"
                            className="hidden flex-col !text-primary md:flex"
                            onClick={() => {
                                posthog.capture('admin_page_opened', {
                                    location: 'nav_bar',
                                })
                            }}
                        >
                            Mine tavler
                        </TopNavigationItem>
                    ) : (
                        <TopNavigationItem
                            active={pathname?.includes('/demo')}
                            as={Link}
                            href="/demo"
                            onClick={() => {
                                posthog.capture('demo_started', {
                                    location: 'nav_bar',
                                })
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
                        onClick={() => {
                            posthog.capture('faq_link_clicked', {
                                location: 'nav_bar',
                            })
                        }}
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
