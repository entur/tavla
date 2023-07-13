import { TTile } from 'types/tile'
import React from 'react'
import { TileSettings } from '../TileSettings'

function TilesOverview({ tiles }: { tiles: TTile[] }) {
    return <TileSettings tile={tiles[0]} />
}

export { TilesOverview }
