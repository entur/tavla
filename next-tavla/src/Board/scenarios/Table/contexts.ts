import { TDepartureFragment } from 'graphql/index'
import React from 'react'

const DeparturesContext = React.createContext<TDepartureFragment[] | undefined>(
    undefined,
)

export { DeparturesContext }
