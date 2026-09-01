'use client'
import { Logo, TopNavigationItem } from '@entur/menu'
import { Login } from 'app/(innlogget)/components/Login/Login'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileNavbar } from './MobileNavbar'

function Navbar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    const { capture } = usePosthogTracking()

    return (
        <nav className="container flex flex-row items-center justify-between gap-3 py-8">
            <Logo
                href="/"
                alt="Gå tilbake til forsiden"
                className="flex md:hidden"
                size="small"
                onClick={() =>
                    capture('go_to_home_page', { location: 'nav_bar' })
                }
            />
            <Logo
                productName="Tavla"
                href="/"
                alt="Gå tilbake til forsiden"
                className="hidden md:flex"
                onClick={() =>
                    capture('go_to_home_page', { location: 'nav_bar' })
                }
            />

            <div className="flex shrink-0 flex-row items-center gap-4">
                <div className="flex flex-row sm:gap-10">
                    {loggedIn ? (
                        <TopNavigationItem
                            active={pathname?.includes('/oversikt')}
                            as={Link}
                            href="/oversikt"
                            className="hidden flex-col !text-primary md:flex"
                            onClick={() => {
                                capture('admin_page_opened', {
                                    location: 'nav_bar',
                                })
                            }}
                        >
                            Mine tavler
                        </TopNavigationItem>
                    ) : (
                        <TopNavigationItem
                            active={pathname?.includes('/lag-tavle')}
                            as={Link}
                            href="/lag-tavle"
                            onClick={() => {
                                capture('board_without_user_started', {
                                    location: 'nav_bar',
                                })
                            }}
                            className="hidden flex-col !text-primary md:flex"
                        >
                            Lag en tavle
                        </TopNavigationItem>
                    )}
                    <TopNavigationItem
                        active={pathname?.includes('/hjelp')}
                        as={Link}
                        href="/hjelp"
                        className="hidden flex-col !text-primary md:flex"
                        onClick={() => {
                            capture('faq_link_clicked', {
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
