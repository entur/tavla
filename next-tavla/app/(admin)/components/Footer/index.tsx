import classes from './styles.module.css'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { Heading3, Link as EnturLink, Paragraph } from '@entur/typography'
import Link from 'next/link'
import { ExternalIcon, FacebookIcon, GithubIcon } from '@entur/icons'

function Footer() {
    return (
        <div className="eds-contrast">
            <div className={classes.footer}>
                <Image src={TavlaLogo} alt="" />
                <div className={classes.flexContainer}>
                    <div>
                        <Heading3>Entur AS</Heading3>
                        <Paragraph className={classes.content}>
                            Rådhusgata 5, 0151 Oslo
                            <br />
                            Postboks 1554, 0117 Oslo
                        </Paragraph>
                        <Paragraph className={classes.content}>
                            Organisasjonsnummer:
                            <br />
                            919 748 932
                        </Paragraph>
                        <Paragraph className={classes.content}>
                            <EnturLink href="https://www.entur.org/kontakt-oss/">
                                Kontakt oss
                                <ExternalIcon className="ml-1" />
                            </EnturLink>
                        </Paragraph>
                    </div>
                    <div>
                        <Heading3>Om siden</Heading3>
                        <Paragraph className={classes.content}>
                            <EnturLink
                                as={Link}
                                href="https://www.entur.org/om-entur/personvern/"
                            >
                                Personvern <ExternalIcon className="ml-1" />
                            </EnturLink>
                        </Paragraph>
                        <Paragraph className={classes.content}>
                            <EnturLink
                                as={Link}
                                href="https://uustatus.no/nb/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
                            >
                                Tilgjengelighetserklæring (bokmål){' '}
                                <ExternalIcon className="ml-1" />
                            </EnturLink>
                        </Paragraph>
                        <Paragraph className={classes.content}>
                            <EnturLink
                                as={Link}
                                href="https://uustatus.no/nn/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
                            >
                                Tilgjengelighetserklæring (nynorsk){' '}
                                <ExternalIcon className="ml-1" />
                            </EnturLink>
                        </Paragraph>
                    </div>
                    <div className={classes.iconContainer}>
                        <Link
                            href="https://facebook.com/entur.org"
                            className="mr-2"
                        >
                            <FacebookIcon size={25} />
                        </Link>
                        <Link href="https://github.com/entur/tavla">
                            <GithubIcon size={25} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Footer }
