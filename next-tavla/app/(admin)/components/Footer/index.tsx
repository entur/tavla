'use client'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { Heading3, Link as EnturLink, Paragraph } from '@entur/typography'
import Link from 'next/link'
import { ExternalIcon, GithubIcon } from '@entur/icons'
import { usePostHog } from 'posthog-js/react'

function Footer() {
    const posthog = usePostHog()
    return (
        <footer className="eds-contrast">
            <div className="container mx-auto pt-16 pb-4">
                <Image src={TavlaLogo} alt="" />
                <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                        <Heading3>Entur AS</Heading3>
                        <Paragraph className=" items-center">
                            Rådhusgata 5, 0151 Oslo
                            <br />
                            Postboks 1554, 0117 Oslo
                        </Paragraph>
                        <Paragraph className="items-center">
                            Organisasjonsnummer:
                            <br />
                            917 422 575
                        </Paragraph>
                        <Paragraph
                            className="items-center flex flex-row gap-1"
                            margin="none"
                        >
                            <EnturLink href="https://www.entur.org/kontakt-oss/">
                                Kontakt kundesenteret
                            </EnturLink>
                            <ExternalIcon className="!top-0" />
                        </Paragraph>
                        <Paragraph className="items-center flex flex-row gap-1">
                            <EnturLink
                                href="mailto:tavla@entur.org"
                                target="_blank"
                                onClick={() =>
                                    posthog.capture('SUPPORT_EMAIL', {
                                        type: 'footer',
                                    })
                                }
                            >
                                Kontakt Tavla
                            </EnturLink>
                            <ExternalIcon className="!top-0" />
                        </Paragraph>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Heading3>Informasjon</Heading3>
                        <div className="flex flex-row gap-1 items-center">
                            <EnturLink
                                as={Link}
                                href="https://uustatus.no/nb/erklaringer/publisert/ffb3d21b-fbb4-48ed-9043-bb2a904f3143"
                                target="_blank"
                            >
                                Tilgjengelighetserklæring
                            </EnturLink>
                            <ExternalIcon aria-hidden />
                        </div>
                        <div>
                            <EnturLink as={Link} href="/privacy">
                                Personvernerklæring
                            </EnturLink>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
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
