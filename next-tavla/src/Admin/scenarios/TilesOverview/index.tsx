import { TTile } from 'types/tile'
import React, { useState } from 'react'
import { TileSettings } from 'Admin/scenarios/TileSettings'
import { SelectTile } from 'Admin/scenarios/SelectTile'
import classes from './styles.module.css'

function TilesOverview({ tiles }: { tiles: TTile[] }) {
    const [selectedTileId, setSelectedTileId] = useState<string>()

    const selectedTile = tiles.find((tile) => tile.uuid === selectedTileId)

    return (
        <div className={classes.overviewWrapper}>
            <SelectTile
                tiles={tiles}
                selectTile={setSelectedTileId}
                selectedTileId={selectedTileId}
            />

            <TileSettings tile={selectedTile} />
        </div>
    )
}

export { TilesOverview }
