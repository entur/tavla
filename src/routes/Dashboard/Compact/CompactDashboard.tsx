import React from 'react'
import { ResponsiveGridDashboard } from 'containers/ResponsiveGridDashboard/ResponsiveGridDashboard'
import { CompactDepartureTile } from './CompactDepartureTile/CompactDepartureTile'

const CompactDashboard = () => (
    <ResponsiveGridDashboard TileComponent={CompactDepartureTile} />
)

export { CompactDashboard }
