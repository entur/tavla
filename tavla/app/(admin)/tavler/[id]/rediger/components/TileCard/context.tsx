import React from 'react'
import { BoardTileDB } from 'src/types/db-types/boards'

export const TileContext = React.createContext<BoardTileDB | undefined>(
    undefined,
)
