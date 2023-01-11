import React from 'react'
import { ExternalIcon } from '@entur/icons'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import classes from './Footer.module.scss'

const Footer: React.FC = () => (
    <div className={classes.Border}>
        <div className={classes.HomeFooter}>
            <div>
                <EnturLogo />
            </div>
            <div className={classes.GridContainer}>
                <div className={classes.GridItem}>
                    <h2 className={classes.FooterH2}>Entur AS</h2>
                    <h3 className={classes.FooterH3}>
                        Rådhusgata 5, 0151 Oslo
                        <br />
                        Postboks 1554 Vika, 0117 Oslo
                    </h3>
                    <h3 className={classes.IconWrapper}>
                        <a
                            href="https://www.facebook.com/entur.org/"
                            className={classes.RoundIcon}
                        >
                            <svg
                                aria-label="Lenke til Facebook"
                                width="1em"
                                height="1em"
                                viewBox="0 0 16 16"
                                className={classes.FacebookIcon}
                            >
                                <path
                                    fill="var(--tavla-background-color)"
                                    d="M6.418 15L6.4 8.875H4V6.25h2.4V4.5C6.4 2.138 7.738 1 9.664 1c.922 0 1.715.075 1.946.108v2.469h-1.336c-1.048 0-1.25.545-1.25 1.344V6.25H12l-.8 2.625H9.024V15H6.418z"
                                ></path>
                            </svg>
                        </a>
                        <a
                            href="https://twitter.com/Entur_AS"
                            className={classes.RoundIcon}
                        >
                            <svg
                                aria-label="Lenke til Twitter"
                                width="1em"
                                height="1em"
                                viewBox="0 0 16 16"
                                className={classes.FacebookIcon}
                            >
                                <path
                                    fill="var(--tavla-background-color)"
                                    d="M15 4.27c-.525.253-1.05.338-1.663.422.613-.338 1.05-.846 1.226-1.523-.526.339-1.138.508-1.838.677a3.109 3.109 0 00-2.1-.846c-1.488 0-2.8 1.27-2.8 2.792 0 .254 0 .423.087.593C5.55 6.3 3.363 5.2 1.963 3.508c-.262.423-.35.846-.35 1.438 0 .93.526 1.777 1.313 2.285-.437 0-.875-.17-1.312-.339 0 1.354.962 2.454 2.275 2.708-.263.085-.526.085-.788.085-.175 0-.35 0-.525-.085.35 1.1 1.4 1.946 2.712 1.946-.962.762-2.187 1.185-3.587 1.185H1C2.313 13.492 3.8 14 5.375 14c5.25 0 8.137-4.23 8.137-7.87v-.338c.613-.423 1.138-.93 1.488-1.523"
                                ></path>
                            </svg>
                        </a>
                    </h3>
                </div>
                <div className={classes.GridItem}>
                    <h2 className={classes.FooterH2}>Kontakt</h2>
                    <div>
                        <h3 className={classes.FooterH3}>
                            {' '}
                            Kundesenter:{' '}
                            <a
                                className={classes.FooterLink}
                                href="tel:+4761279088"
                            >
                                61 27 90 88
                            </a>
                        </h3>
                        <h3 className={classes.FooterH3}>
                            <a
                                className={classes.FooterLink}
                                href="mailto:feedback@entur.org"
                            >
                                feedback@entur.org
                            </a>
                        </h3>
                    </div>
                </div>
                <div className={classes.GridItem}>
                    <h2 className={classes.FooterH2}>Om siden</h2>
                    <h3 className={classes.FooterH3}>
                        <a className={classes.FooterLink}>Nettstedkart</a>
                    </h3>
                    <h3 className={classes.FooterH3}>
                        <a className={classes.FooterLink} href="/privacy">
                            Personvern
                        </a>
                    </h3>
                    <h3 className={classes.FooterH3}>
                        {' '}
                        <a
                            href="https://uustatus.no/nb/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.FooterLink}
                            aria-label="Tilgjengelighetserklæring (bokmål)"
                        >
                            Tilgjengelighetserklæring (bokmål)
                            <ExternalIcon className={classes.Icon} />
                        </a>
                    </h3>
                    <h3 className={classes.FooterH3}>
                        {' '}
                        <a
                            href="https://uustatus.no/nn/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.FooterLink}
                            aria-label="Tilgjengelighetserklæring (nynorsk)"
                        >
                            Tilgjengelighetserklæring (nynorsk)
                            <ExternalIcon className={classes.Icon} />
                        </a>
                    </h3>
                </div>
            </div>
        </div>
    </div>
)

export { Footer }
