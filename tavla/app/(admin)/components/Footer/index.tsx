'use client'
import { ExternalIcon, GithubIcon } from '@entur/icons'
import { Link as EnturLink, Heading3, Paragraph } from '@entur/typography'
import { showUC_UI as showUserCentricsUI } from 'app/components/ConsentHandler'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import Image from 'next/image'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import DeleteAccount from '../DeleteAccount'

function Footer({ loggedIn }: { loggedIn: boolean }) {
    const posthog = usePostHog()
    return (
        <footer className="eds-contrast">
            <div className="container pb-20 pt-16">
                <Image src={TavlaLogo} alt="Entur Tavla logo" />
                <div className="flex flex-col justify-between sm:flex-row">
                    <address className="not-italic">
                        <Heading3 as="h2">Entur AS</Heading3>
                        <ul className="flex flex-col gap-0">
                            <li>
                                <address className="items-center">
                                    Rådhusgata 5, 0151 Oslo
                                    <br aria-hidden />
                                    Postboks 1554, 0117 Oslo
                                </address>
                            </li>
                            <li>
                                <Paragraph className="items-center">
                                    Organisasjonsnummer:
                                    <br aria-hidden />
                                    917 422 575
                                </Paragraph>
                            </li>
                            <li>
                                <Paragraph
                                    className="flex flex-row items-center gap-1"
                                    margin="none"
                                >
                                    <EnturLink href="https://www.entur.org/kontakt-oss/">
                                        Kontakt kundesenteret
                                    </EnturLink>
                                    <ExternalIcon
                                        aria-hidden
                                        className="!top-0"
                                    />
                                </Paragraph>
                            </li>
                            <li>
                                <Paragraph className="flex flex-row items-center gap-1">
                                    <EnturLink
                                        href="mailto:tavla@entur.org"
                                        target="_blank"
                                    >
                                        Kontakt Tavla
                                    </EnturLink>
                                    <ExternalIcon
                                        aria-hidden
                                        className="!top-0"
                                    />
                                </Paragraph>
                            </li>
                        </ul>
                    </address>
                    <div className="flex flex-col gap-4">
                        <Heading3 as="h2">Informasjon</Heading3>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <EnturLink
                                    href="/demo"
                                    as={Link}
                                    onClick={() =>
                                        posthog.capture('DEMO_FROM_FOOTER')
                                    }
                                >
                                    Test ut Tavla
                                </EnturLink>
                            </li>
                            <li>
                                <EnturLink href="/hjelp" as={Link}>
                                    Ofte stilte spørsmål
                                </EnturLink>
                            </li>
                            <li className="flex flex-row items-center gap-1">
                                <EnturLink
                                    as={Link}
                                    href="https://uustatus.no/nb/erklaringer/publisert/ffb3d21b-fbb4-48ed-9043-bb2a904f3143"
                                    target="_blank"
                                >
                                    Tilgjengelighetserklæring
                                </EnturLink>
                                <ExternalIcon aria-hidden />
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
                                    onClick={showUserCentricsUI}
                                    className="self-start"
                                >
                                    Informasjonskapsler
                                </EnturLink>
                            </li>
                            <li className="flex flex-row items-center gap-1">
                                <EnturLink
                                    href="https://github.com/entur/tavla"
                                    target="_blank"
                                >
                                    GitHub
                                </EnturLink>
                                <ExternalIcon aria-hidden />
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
