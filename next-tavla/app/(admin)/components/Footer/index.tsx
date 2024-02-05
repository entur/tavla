import classes from './styles.module.css'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { Heading3, Link as EnturLink, Paragraph } from '@entur/typography'
import Link from 'next/link'
import { ExternalIcon, GithubIcon } from '@entur/icons'

function Footer() {
    return (
        <footer className="eds-contrast">
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
                        <Heading3>Informasjon</Heading3>
                        <Paragraph className="m-0 text-rem-0-9">
                            <EnturLink
                                as={Link}
                                href="https://uustatus.no/nb/erklaringer/publisert/ffb3d21b-fbb4-48ed-9043-bb2a904f3143"
                            >
                                Tilgjengelighetserklæring
                                <ExternalIcon className="ml-1" />
                            </EnturLink>
                        </Paragraph>
                    </div>
                    <div className={classes.iconContainer}>
                        <Link href="https://github.com/entur/tavla">
                            <GithubIcon size={25} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { Footer }
