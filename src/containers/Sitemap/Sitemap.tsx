import React from 'react'
import { Helmet } from 'react-helmet'
import { Contrast } from '@entur/layout'
import { Navbar } from '../Navbar/Navbar'
import classes from './Sitemap.module.scss'

const Sitemap: React.FC = () => {
    return (
        <Contrast>
            <Helmet>
                <title>Mine tavler - Tavla - Entur</title>
            </Helmet>
            <Navbar />
            <div className={classes.Wrapper}>
                <div className={classes.SitemapHeader}>
                    <h1 className={classes.Title}>Nettstedkart</h1>
                    <p className={classes.LeadParagraph}>
                        I listen under kan du se hvordan nettsiden er bygd opp
                        og hvor sidene ligger i forhold til hverandre.
                    </p>
                    <div className={classes.MapWrapper}>
                        <p className={classes.LittleText}>
                            Scroll nedover siden eller bruk den innbygde
                            søkefunksjonen i nettleseren (⌘+F) for å finne det
                            du leter etter.
                        </p>

                        <h2>Innhold</h2>
                        <ul>
                            <li>Mine tavler</li>
                            <ul></ul>
                            <li>Personvern</li>
                            <li>Nettstedkart</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Contrast>
    )
}

export { Sitemap }
