import { TTile } from 'types/tile'
import React from 'react'
import { TileSettings } from '../TileSettings'

function TilesOverview({ tiles }: { tiles: TTile[] }) {
    const name = 'Majorstuen'

    return <TileSettings tile={tiles[0]} name={name} />
}

export { TilesOverview }
