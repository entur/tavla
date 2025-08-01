import { TDepartureFragment } from 'graphql/index'
import React from 'react'
import { TTile } from 'types/tile'

const DeparturesContext = React.createContext<TDepartureFragment[] | undefined>(
    undefined,
)

const TileContext = React.createContext<TTile | undefined>(undefined)

export { DeparturesContext, TileContext }
