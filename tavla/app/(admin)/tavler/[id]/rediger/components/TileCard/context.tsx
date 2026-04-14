import React from 'react'
import type { BoardTileDB } from 'src/types/db-types/boards'

export const TileContext = React.createContext<BoardTileDB | undefined>(
    undefined,
)
