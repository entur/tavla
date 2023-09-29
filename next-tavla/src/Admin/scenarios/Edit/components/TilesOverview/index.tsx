import { TTile } from 'types/tile'
import React, { useEffect, useState } from 'react'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab'
import classes from './styles.module.css'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'Admin/components/IllustratedInfo'
import { TileSettings } from '../TileSettings'

function TilesOverview({ tiles }: { tiles: TTile[] }) {
    const [activeTab, setActiveTab] = useState(0)

    useEffect(() => {
        setActiveTab(0)
    }, [tiles.length])

    if (isEmpty(tiles))
        return (
            <IllustratedInfo
                title="Ingen holdeplasser i Tavla"
                description="Legg til en holdeplass for å kunne bestemme plattformer og
                linjer som skal vises på avgangstavla"
            />
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
            <TabPanels className={classes.tabPanels}>
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
