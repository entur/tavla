'use client'
import { SideNavigationItem } from '@entur/menu'
import Link from 'next/link'
import Image from 'next/image'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import { CreateBoard } from './CreateBoard'
import { usePathname } from 'next/navigation'
import { Button, IconButton } from '@entur/button'
import { LeftArrowIcon, MenuIcon } from '@entur/icons'
import { useState } from 'react'
import { SideNavigation } from '@entur/menu'
import { logout } from './Login/actions'
import { Heading2 } from '@entur/typography'
import { Modal } from '@entur/modal'

function SideNavBar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    if (!loggedIn) return null

    return (
        <div className="visible md:hidden">
            <IconButton
                onClick={() => setIsOpen(!isOpen)}
                className="bg-contrast rounded-full p-3"
            >
                <MenuIcon content="Meny" color="background" />
            </IconButton>
            <Modal
                open={isOpen}
                onDismiss={() => setIsOpen(false)}
                size="medium"
                className="h-full w-9/12 fixed top-0 left-0 py-10 !max-h-full !rounded-none !p-0 overflow-visible"
            >
                <SideNavigation className="h-full pt-10">
                    <div className="pl-10">
                        <Link href="/" aria-label="Tilbake til landingssiden">
                            <Image src={TavlaLogoBlue} height={22} alt="" />
                        </Link>
                        <Heading2 className="mt-16 mb-4">Meny</Heading2>
                    </div>

                    <div className="bg-secondary">
                        <SideNavigationItem as={Link} href="?board=name">
                            Opprett tavle
                            <CreateBoard />
                        </SideNavigationItem>
                        <SideNavigationItem
                            href="/boards"
                            active={pathname?.includes('/boards')}
                        >
                            Tavler
                        </SideNavigationItem>
                        <SideNavigationItem
                            href="/organizations"
                            active={pathname?.includes('/organizations')}
                        >
                            Organisasjoner
                        </SideNavigationItem>
                        <SideNavigationItem
                            as={Button}
                            className="[&>button]:justify-start [&>button]:px-10"
                            onClick={async () => {
                                setIsOpen(false)
                                await logout()
                            }}
                        >
                            Logg ut
                        </SideNavigationItem>
                    </div>
                </SideNavigation>
                <IconButton
                    onClick={() => setIsOpen(false)}
                    className="bg-contrast rounded-full p-3 absolute bottom-[10%] -right-5"
                >
                    <LeftArrowIcon color="background" />
                </IconButton>
            </Modal>
        </div>
    )
}

export { SideNavBar }
