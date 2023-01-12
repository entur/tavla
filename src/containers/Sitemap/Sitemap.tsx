import React from 'react'
import { Helmet } from 'react-helmet'
import { Contrast } from '@entur/layout'
import { Navbar } from '../Navbar/Navbar'
import classes from './Sitemap.module.scss'

const Sitemap: React.FC = () => (
    <Contrast>
        <Helmet>
            <title>Mine tavler - Tavla - Entur</title>
        </Helmet>
        <Navbar />
        <div className={classes.Wrapper}>
            <div>
                <h1 className={classes.Title}>Nettstedkart</h1>
                <p className={classes.LeadParagraph}>
                    I listen under kan du se hvordan nettsiden er bygd opp og
                    hvor sidene ligger i forhold til hverandre.
                </p>
                <p className={classes.LittleText}>
                    Scroll nedover siden eller bruk den innbygde søkefunksjonen
                    i nettleseren (⌘+F) for å finne det du leter etter.
                </p>
                <div className={classes.MapWrapper}>
                    <h2 className={classes.SitemapHeader}>Innhold</h2>
                    <ul className={classes.SiteMap}>
                        <li className={classes.SitemapItem}>
                            <a href="/privacy" className={classes.MapLink}>
                                Mine tavler
                            </a>
                        </li>

                        <li className={classes.SitemapItem}>
                            <a href="/privacy" className={classes.MapLink}>
                                Personvern
                            </a>
                        </li>
                        <li className={classes.SitemapItem}>
                            <a href="/nettstedkart" className={classes.MapLink}>
                                Nettstedkart
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </Contrast>
)

export { Sitemap }
