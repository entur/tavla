'use client'
import { SideNavigationItem } from '@entur/menu'
import Link from 'next/link'
import Image from 'next/image'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import { usePathname } from 'next/navigation'
import { Button, IconButton } from '@entur/button'
import { CloseIcon, LeftArrowIcon, MenuIcon } from '@entur/icons'
import { useState } from 'react'
import { SideNavigation } from '@entur/menu'
import { logout } from './Login/actions'
import { Heading2 } from '@entur/typography'
import { Modal } from '@entur/modal'

function MobileNavbar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    if (!loggedIn) return null

    return (
        <div className="block md:hidden">
            <IconButton
                onClick={() => setIsOpen(!isOpen)}
                className="!rounded-full !bg-contrast !p-3"
            >
                <MenuIcon content="Meny" color="background" />
            </IconButton>

            <Modal
                open={isOpen}
                onDismiss={() => setIsOpen(false)}
                size="small"
                closeLabel="Lukk meny"
                className="!fixed !left-0 !top-0 !h-full !max-h-full !w-9/12 overflow-visible !rounded-none !p-0"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={() => {
                        setIsOpen(false)
                    }}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                <SideNavigation className="!bg-primary !pt-10">
                    <div className="pl-10">
                        <Link href="/" aria-label="Tilbake til landingssiden">
                            <Image src={TavlaLogoBlue} height={22} alt="" />
                        </Link>
                        <Heading2 className="!mb-4 !mt-16">Meny</Heading2>
                    </div>

                    <div className="bg-secondary">
                        <SideNavigationItem
                            href="/oversikt"
                            active={pathname?.includes('/oversikt')}
                        >
                            Mine tavler
                        </SideNavigationItem>

                        <SideNavigationItem
                            as={Button}
                            className="[&>button]:justify-start [&>button]:bg-secondary [&>button]:px-10 [&>button]:text-primary"
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
                    className="!absolute !bottom-[10%] !right-5 !rounded-full !bg-contrast !p-3"
                >
                    <LeftArrowIcon color="background" />
                </IconButton>
            </Modal>
        </div>
    )
}

export { MobileNavbar }
