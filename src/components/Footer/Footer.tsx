import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExternalIcon, FacebookIcon, TwitterIcon } from '@entur/icons'
import { Heading3, Link as EnturLink, Paragraph } from '@entur/typography'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import classes from './Footer.module.scss'

const Footer: React.FC = () => {
    const { documentId } = useParams<{ documentId: string }>()
    const nettstedKarturl = useMemo(
        () => '/nettstedkart' + (documentId ? `?documentId=${documentId}` : ''),
        [documentId],
    )

    return (
        <div className={classes.Border}>
            <div className={classes.HomeFooter}>
                <div>
                    <EnturLogo />
                </div>
                <div className={classes.FlexContainer}>
                    <div className={classes.FlexItem}>
                        <Heading3 className={classes.FooterHeading}>
                            Entur AS
                        </Heading3>
                        <Paragraph className={classes.FooterInfoText}>
                            Rådhusgata 5, 0151 Oslo
                            <br />
                            Postboks 1554 Vika, 0117 Oslo
                        </Paragraph>
                        <div className={classes.IconWrapper}>
                            <a
                                href="https://www.facebook.com/entur.org/"
                                className={classes.RoundIcon}
                            >
                                <FacebookIcon size={20} color="#181c56" />
                            </a>
                            <a
                                href="https://twitter.com/Entur_AS"
                                className={classes.RoundIcon}
                            >
                                <TwitterIcon size={20} color="#181c56" />
                            </a>
                        </div>
                    </div>
                    <div className={classes.FlexItem}>
                        <Heading3>Kontakt</Heading3>
                        <div>
                            <Paragraph className={classes.FooterInfoText}>
                                Kundesenter:{' '}
                                <EnturLink href="tel:+4761279088">
                                    61 27 90 88
                                </EnturLink>
                            </Paragraph>
                            <Paragraph className={classes.FooterInfoText}>
                                <EnturLink href="mailto:feedback@entur.org">
                                    feedback@entur.org
                                </EnturLink>
                            </Paragraph>
                        </div>
                    </div>
                    <div className={classes.FlexItem}>
                        <Heading3>Om siden</Heading3>
                        <Paragraph className={classes.FooterInfoText}>
                            <EnturLink
                                aria-label="Nettstedkart"
                                to={nettstedKarturl}
                                as={Link}
                            >
                                Nettstedkart
                            </EnturLink>
                        </Paragraph>
                        <Paragraph className={classes.FooterInfoText}>
                            <EnturLink href="/privacy">Personvern</EnturLink>
                        </Paragraph>
                        <Paragraph className={classes.FooterInfoText}>
                            <EnturLink
                                href="https://uustatus.no/nb/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Tilgjengelighetserklæring (bokmål)"
                            >
                                Tilgjengelighetserklæring (bokmål)
                                <ExternalIcon className={classes.Icon} />
                            </EnturLink>
                        </Paragraph>
                        <Paragraph className={classes.FooterInfoText}>
                            <EnturLink
                                href="https://uustatus.no/nn/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Tilgjengelighetserklæring (nynorsk)"
                            >
                                Tilgjengelighetserklæring (nynorsk)
                                <ExternalIcon className={classes.Icon} />
                            </EnturLink>
                        </Paragraph>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Footer }
