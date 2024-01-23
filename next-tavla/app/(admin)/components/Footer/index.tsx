import classes from './styles.module.css'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { Heading3, Link as EnturLink, Paragraph } from '@entur/typography'
import Link from 'next/link'

function Footer() {
    return (
        <div className="eds-contrast">
            <div className={classes.footer}>
                <Image src={TavlaLogo} alt="" />
                <div className="flexRow justifyBetween ">
                    <div>
                        <Heading3>Entur AS</Heading3>
                        <Paragraph className="m-0">
                            Rådhusgata 5, 0151 Oslo
                        </Paragraph>
                        <Paragraph>Postboks 1554, 0117 Oslo</Paragraph>
                        <Paragraph className="m-0">
                            Organisasjonsnummer:
                        </Paragraph>
                        <Paragraph> 919 748 932</Paragraph>
                    </div>
                    <div>
                        <Heading3>Informasjon</Heading3>
                        <Paragraph>
                            <EnturLink
                                as={Link}
                                href="https://www.entur.org/om-entur/personvern/"
                            >
                                Personvern
                            </EnturLink>
                        </Paragraph>
                        <Paragraph>
                            <EnturLink
                                as={Link}
                                href="https://uustatus.no/nb/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
                            >
                                Tilgjengelighetserklæring (bokmål)
                            </EnturLink>
                        </Paragraph>
                        <Paragraph>
                            <EnturLink
                                as={Link}
                                href="https://uustatus.no/nn/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
                            >
                                Tilgjengelighetserklæring (nynorsk)
                            </EnturLink>
                        </Paragraph>
                    </div>
                    <div>
                        <Heading3>Entur AS</Heading3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Footer }
