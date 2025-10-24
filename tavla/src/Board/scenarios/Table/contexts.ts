import { TDepartureFragment } from 'graphql/index'
import React from 'react'
import { BoardTileDB } from 'types/db-types/boards'

const DeparturesContext = React.createContext<TDepartureFragment[] | undefined>(
    undefined,
)

const TileContext = React.createContext<BoardTileDB | undefined>(undefined)

export { DeparturesContext, TileContext }
