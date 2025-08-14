'use client'
import { ExternalIcon, GithubIcon } from '@entur/icons'
import { Link as EnturLink, Heading3, Paragraph } from '@entur/typography'
import { showUC_UI } from 'app/components/ConsentHandler'
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
                    <div>
                        <Heading3 as="h2">Entur AS</Heading3>
                        <Paragraph className="items-center">
                            Rådhusgata 5, 0151 Oslo
                            <br aria-hidden />
                            Postboks 1554, 0117 Oslo
                        </Paragraph>
                        <Paragraph className="items-center">
                            Organisasjonsnummer:
                            <br aria-hidden />
                            917 422 575
                        </Paragraph>
                        <Paragraph
                            className="flex flex-row items-center gap-1"
                            margin="none"
                        >
                            <EnturLink href="https://www.entur.org/kontakt-oss/">
                                Kontakt kundesenteret
                            </EnturLink>
                            <ExternalIcon aria-hidden className="!top-0" />
                        </Paragraph>
                        <Paragraph className="flex flex-row items-center gap-1">
                            <EnturLink
                                href="mailto:tavla@entur.org"
                                target="_blank"
                            >
                                Kontakt Tavla
                            </EnturLink>
                            <ExternalIcon aria-hidden className="!top-0" />
                        </Paragraph>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Heading3>Informasjon</Heading3>
                        <div>
                            <EnturLink
                                href="/demo"
                                as={Link}
                                onClick={() =>
                                    posthog.capture('DEMO_FROM_FOOTER')
                                }
                            >
                                Test ut Tavla
                            </EnturLink>
                        </div>
                        <div>
                            <EnturLink href="/help" as={Link}>
                                Ofte stilte spørsmål
                            </EnturLink>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <EnturLink
                                as={Link}
                                href="https://uustatus.no/nb/erklaringer/publisert/ffb3d21b-fbb4-48ed-9043-bb2a904f3143"
                                target="_blank"
                            >
                                Tilgjengelighetserklæring
                            </EnturLink>
                            <ExternalIcon aria-hidden />
                        </div>
                        {loggedIn && (
                            <div className="flex flex-row items-center gap-1">
                                <DeleteAccount />
                            </div>
                        )}
                        <EnturLink as={Link} href="/privacy">
                            Personvernerklæring
                        </EnturLink>
                        <EnturLink
                            as={Link}
                            href="javascript:void(0)"
                            onClick={showUC_UI}
                        >
                            Informasjonskapsler
                        </EnturLink>
                        <div className="flex flex-row items-center gap-1">
                            <EnturLink
                                href="https://github.com/entur/tavla"
                                target="_blank"
                            >
                                GitHub
                            </EnturLink>
                            <ExternalIcon aria-hidden />
                            <GithubIcon size={25} aria-hidden />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { Footer }
