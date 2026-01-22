import React from 'react'
import { BoardTileDB } from 'types/db-types/boards'

export const TileContext = React.createContext<BoardTileDB | undefined>(
    undefined,
)
