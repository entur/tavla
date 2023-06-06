import { TDepartureFragment } from 'graphql/index'
import React from 'react'

const DepartureContext = React.createContext<TDepartureFragment | undefined>(
    undefined,
)

export { DepartureContext }
