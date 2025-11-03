import { TDepartureFragment } from 'graphql/index'
import React from 'react'
import { BoardTileDB } from 'types/db-types/boards'
import { TDepartureWithTile } from '../Board/utils'

const DeparturesContext = React.createContext<
    TDepartureFragment[] | TDepartureWithTile[] | undefined
>(undefined)

const TileContext = React.createContext<BoardTileDB | undefined>(undefined)

export { DeparturesContext, TileContext }
