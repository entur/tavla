import { TTile } from 'types/tile'
import React from 'react'
import { TileSettings } from 'Admin/scenarios/TileSettings'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab'

function TilesOverview({ tiles }: { tiles: TTile[] }) {
    if (tiles.length === 0)
        return (
            <div>
                Legg til en holdeplass for å kunne bestemme plattformer og
                linjer som skal vises på avgangstavla
            </div>
        )

    return (
        <Tabs style={{ width: '100%' }}>
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
