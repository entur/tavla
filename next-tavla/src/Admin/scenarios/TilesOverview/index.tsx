import { TTile } from 'types/tile'
import React, { useEffect, useState } from 'react'
import { TileSettings } from 'Admin/scenarios/TileSettings'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab'
import Image from 'next/image'
import animals from 'assets/illustrations/Animals.png'
import classes from './styles.module.css'
import { Heading2, LeadParagraph } from '@entur/typography'

function TilesOverview({ tiles }: { tiles: TTile[] }) {
    const [activeTab, setActiveTab] = useState(0)

    useEffect(() => {
        setActiveTab(0)
    }, [tiles.length])

    if (tiles.length === 0)
        return (
            <div className={classes.info}>
                <Image src={animals} alt="illustration" />
                <Heading2 className={classes.infoHeading}>
                    Ingen holdeplasser i Tavla
                </Heading2>
                <LeadParagraph>
                    Legg til en holdeplass for å kunne bestemme plattformer og
                    linjer som skal vises på avgangstavla
                </LeadParagraph>
            </div>
        )

    return (
        <Tabs
            className={classes.tabs}
            index={activeTab}
            onChange={(newIndex) => setActiveTab(newIndex)}
        >
            <TabList data-cy="tiles">
                {tiles.map((tile) => (
                    <Tab key={tile.uuid}>{tile.name ?? tile.placeId}</Tab>
                ))}
            </TabList>
            <TabPanels>
                {tiles.map((tile) => (
                    <TabPanel key={tile.uuid}>
                        <TileSettings tile={tile} />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    )
}

export { TilesOverview }
