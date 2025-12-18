'use client'
import { IconButton, PrimaryButton } from '@entur/button'
import { CloseIcon, LeftArrowIcon, MenuIcon } from '@entur/icons'
import { SideNavigation, SideNavigationItem } from '@entur/menu'
import { Modal } from '@entur/modal'
import { Heading2 } from '@entur/typography'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'
import { useState } from 'react'

function MobileNavbar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="block md:hidden">
            <PrimaryButton
                size="medium"
                onClick={() => setIsOpen(!isOpen)}
                width="fluid"
                className="!min-w-0"
            >
                <MenuIcon content="Meny" color="background" /> Meny
            </PrimaryButton>

            <Modal
                open={isOpen}
                onDismiss={() => setIsOpen(false)}
                size="small"
                closeLabel="Lukk meny"
                className="!fixed !left-0 !top-0 !h-full !max-h-full !w-9/12 !overflow-y-auto !rounded-none !p-0"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={() => {
                        setIsOpen(false)
                    }}
                    className="absolute right-4 top-4 z-10"
                >
                    <CloseIcon />
                </IconButton>
                <SideNavigation className="!bg-primary !pb-24 !pt-10">
                    <div className="pl-10">
                        <Link href="/" aria-label="Tilbake til landingssiden">
                            <Image src={TavlaLogoBlue} height={22} alt="" />
                        </Link>
                        <Heading2 className="!mb-4 !mt-16">Meny</Heading2>
                    </div>

                    <div className="bg-secondary">
                        {loggedIn ? (
                            <SideNavigationItem
                                active={pathname?.includes('/oversikt')}
                                onClick={async () => {
                                    setIsOpen(false)
                                }}
                                as={Link}
                                href="/oversikt"
                                className="!text-primary"
                            >
                                Mine tavler
                            </SideNavigationItem>
                        ) : (
                            <SideNavigationItem
                                active={pathname?.includes('/demo')}
                                as={Link}
                                href="/demo"
                                onClick={async () => {
                                    posthog.capture('DEMO_FROM_NAV_BAR_BTN')
                                    setIsOpen(false)
                                }}
                                className="!text-primary"
                            >
                                Test ut Tavla
                            </SideNavigationItem>
                        )}

                        <SideNavigationItem
                            active={pathname?.includes('/hjelp')}
                            onClick={async () => {
                                setIsOpen(false)
                            }}
                            as={Link}
                            href="/hjelp"
                            className="!text-primary"
                        >
                            Ofte stilte spørsmål
                        </SideNavigationItem>
                    </div>
                </SideNavigation>
                <div className="pointer-events-none sticky bottom-[10%] flex justify-end pb-4 pr-5">
                    <IconButton
                        onClick={() => setIsOpen(false)}
                        className="pointer-events-auto !rounded-full !bg-contrast !p-3"
                    >
                        <LeftArrowIcon color="background" />
                    </IconButton>
                </div>
            </Modal>
        </div>
    )
}

export { MobileNavbar }
