import React from 'react'
import { Helmet } from 'react-helmet'
import { Contrast } from '@entur/layout'
import { Heading1, Heading2, Link, Paragraph } from '@entur/typography'
import { Navbar } from '../Navbar/Navbar'
import classes from './Sitemap.module.scss'

const Sitemap: React.FC = () => (
    <Contrast>
        <Helmet>
            <title>Nettstedkart - Tavla - Entur</title>
        </Helmet>
        <Navbar />
        <div className={classes.Wrapper}>
            <Heading1>Nettstedkart</Heading1>
            <Paragraph className={classes.LeadParagraph}>
                I listen under kan du se hvordan nettsiden er bygd opp og hvor
                sidene ligger i forhold til hverandre.
            </Paragraph>
            <Paragraph>
                Scroll nedover siden eller bruk den innbygde søkefunksjonen i
                nettleseren (⌘+F) for å finne det du leter etter.
            </Paragraph>
            <Heading2 className={classes.SitemapHeader}>Innhold</Heading2>
            <ul>
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
    </Contrast>
)

export { Sitemap }
