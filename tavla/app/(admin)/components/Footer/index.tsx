'use client'
import { GithubIcon } from '@entur/icons'
import { Link as EnturLink, Heading3, Paragraph } from '@entur/typography'
import { showUC_UI as showUserCentricsUI } from 'app/components/ConsentHandler'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import Image from 'next/image'
import Link from 'next/link'
import DeleteAccount from '../DeleteAccount'

function Footer({ loggedIn }: { loggedIn: boolean }) {
    const posthog = usePosthogTracking()
    return (
        <footer className="eds-contrast">
            <div className="container pb-20 pt-16">
                <Image src={TavlaLogo} alt="Entur Tavla logo" />
                <div className="flex flex-col justify-between sm:flex-row">
                    <div className="not-italic">
                        <Heading3 as="h2">Entur AS</Heading3>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <address className="items-center not-italic">
                                    Rådhusgata 5, 0151 Oslo
                                    <br aria-hidden />
                                    Postboks 1554, 0117 Oslo
                                </address>
                            </li>
                            <li className="items-center">
                                <Paragraph className="items-center">
                                    Organisasjonsnummer:
                                    <br aria-hidden />
                                    917 422 575
                                </Paragraph>
                            </li>
                            <li>
                                <EnturLink
                                    external
                                    href="https://www.entur.org/kontakt-oss/"
                                    onClick={() =>
                                        posthog.capture(
                                            'contact_customer_service',
                                            { location: 'footer' },
                                        )
                                    }
                                    target="_blank"
                                >
                                    Kontakt kundesenteret
                                </EnturLink>
                            </li>
                            <li>
                                <EnturLink
                                    href="mailto:tavla@entur.org"
                                    target="_blank"
                                    onClick={() =>
                                        posthog.capture('contact_tavla', {
                                            location: 'footer',
                                        })
                                    }
                                >
                                    Kontakt Tavla
                                </EnturLink>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Heading3 as="h2">Informasjon</Heading3>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <EnturLink
                                    href="/demo"
                                    as={Link}
                                    onClick={() =>
                                        posthog.capture('demo_started', {
                                            location: 'footer',
                                        })
                                    }
                                >
                                    Test ut Tavla
                                </EnturLink>
                            </li>
                            <li>
                                <EnturLink
                                    href="/hjelp"
                                    as={Link}
                                    onClick={() =>
                                        posthog.capture('faq_link_clicked', {
                                            location: 'footer',
                                        })
                                    }
                                >
                                    Ofte stilte spørsmål
                                </EnturLink>
                            </li>
                            <li className="flex flex-row items-center gap-1">
                                <EnturLink
                                    as={Link}
                                    external
                                    href="https://uustatus.no/nb/erklaringer/publisert/ffb3d21b-fbb4-48ed-9043-bb2a904f3143"
                                    target="_blank"
                                >
                                    Tilgjengelighetserklæring
                                </EnturLink>
                            </li>
                            {loggedIn && (
                                <li className="flex flex-row items-center gap-1">
                                    <DeleteAccount />
                                </li>
                            )}
                            <li>
                                <EnturLink as={Link} href="/personvern">
                                    Personvernerklæring
                                </EnturLink>
                            </li>
                            <li>
                                <EnturLink
                                    as="button"
                                    onClick={() => {
                                        posthog.capture(
                                            'cookie_settings_opened',
                                            {
                                                location: 'footer',
                                            },
                                        )
                                        showUserCentricsUI()
                                    }}
                                    className="self-start"
                                >
                                    Informasjonskapsler
                                </EnturLink>
                            </li>
                            <li className="flex flex-row items-center gap-1">
                                <EnturLink
                                    external
                                    href="https://github.com/entur/tavla"
                                    target="_blank"
                                    onClick={() =>
                                        posthog.capture('github_link_clicked', {
                                            location: 'footer',
                                        })
                                    }
                                >
                                    GitHub
                                </EnturLink>
                                <GithubIcon size={25} aria-hidden />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { Footer }
