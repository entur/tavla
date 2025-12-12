'use client'
import { GithubIcon } from '@entur/icons'
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
                        <div className="flex flex-col gap-4">
                            <EnturLink
                                href="https://www.entur.org/kontakt-oss/"
                                target="_blank"
                                external
                            >
                                Kontakt kundesenteret
                            </EnturLink>

                            <EnturLink
                                href="mailto:tavla@entur.org"
                                target="_blank"
                            >
                                Kontakt Tavla på mail
                            </EnturLink>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Heading3 as="h2">Informasjon</Heading3>
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
                            <EnturLink href="/hjelp" as={Link}>
                                Ofte stilte spørsmål
                            </EnturLink>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <EnturLink
                                as={Link}
                                href="https://uustatus.no/nb/erklaringer/publisert/ffb3d21b-fbb4-48ed-9043-bb2a904f3143"
                                target="_blank"
                                external
                            >
                                Tilgjengelighetserklæring
                            </EnturLink>
                        </div>
                        {loggedIn && (
                            <div className="flex flex-row items-center gap-1">
                                <DeleteAccount />
                            </div>
                        )}
                        <EnturLink as={Link} href="/personvern">
                            Personvernerklæring
                        </EnturLink>
                        <EnturLink
                            as="button"
                            onClick={showUserCentricsUI}
                            className="self-start"
                        >
                            Informasjonskapsler
                        </EnturLink>
                        <div className="flex flex-row items-center gap-1">
                            <EnturLink
                                href="https://github.com/entur/tavla"
                                external
                                target="_blank"
                            >
                                GitHub
                            </EnturLink>
                            <GithubIcon size={20} aria-hidden />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { Footer }
