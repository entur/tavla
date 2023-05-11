import { TDeparture } from 'types/graphql'
import React from 'react'

const DepartureContext = React.createContext<TDeparture | undefined>(undefined)

export { DepartureContext }
