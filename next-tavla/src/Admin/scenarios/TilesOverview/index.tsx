import { TTile } from 'types/tile'
import React, { useState } from 'react'
import { TileSettings } from '../TileSettings'
import { SelectTile } from './components/SelectTile'
import classes from './styles.module.css'
import { Heading2 } from '@entur/typography'

function TilesOverview({ tiles }: { tiles: TTile[] }) {
    const [selectedTileId, setSelectedId] = useState<string>()

    const selectedTile = tiles.find((tile) => tile.uuid === selectedTileId)

    return (
        <div className={classes.overviewWrapper}>
            <SelectTile
                tiles={tiles}
                selectTile={setSelectedId}
                selectedTileId={selectedTileId}
            />
            <div>
                <Heading2>Rediger holdeplass</Heading2>
                <TileSettings tile={selectedTile} />
            </div>
        </div>
    )
}

export { TilesOverview }
