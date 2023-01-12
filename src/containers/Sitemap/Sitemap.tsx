import React from 'react'
import { Helmet } from 'react-helmet'
import { Contrast } from '@entur/layout'
import {
    Heading1,
    Heading2,
    Heading3,
    Link,
    Paragraph,
} from '@entur/typography'
import { Navbar } from '../Navbar/Navbar'
import classes from './Sitemap.module.scss'

const Sitemap: React.FC = () => (
    <Contrast>
        <Helmet>
            <title>Mine tavler - Tavla - Entur</title>
        </Helmet>
        <Navbar />
        <div className={classes.Wrapper}>
            <Heading1>Nettstedkart</Heading1>
            <Heading3>
                I listen under kan du se hvordan nettsiden er bygd opp og hvor
                sidene ligger i forhold til hverandre.
            </Heading3>
            <Paragraph>
                Scroll nedover siden eller bruk den innbygde søkefunksjonen i
                nettleseren (⌘+F) for å finne det du leter etter.
            </Paragraph>
            <div className={classes.MapWrapper}>
                <Heading2 className={classes.SitemapHeader}>Innhold</Heading2>
                <ul className={classes.SiteMap}>
                    <li className={classes.SitemapItem}>
                        <Link href="/privacy" className={classes.MapLink}>
                            Mine tavler
                        </Link>
                    </li>

                    <li className={classes.SitemapItem}>
                        <Link href="/privacy" className={classes.MapLink}>
                            Personvern
                        </Link>
                    </li>
                    <li className={classes.SitemapItem}>
                        <Link href="/nettstedkart" className={classes.MapLink}>
                            Nettstedkart
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </Contrast>
)

export { Sitemap }
