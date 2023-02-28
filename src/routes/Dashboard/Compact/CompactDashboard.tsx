import React from 'react'
import { ResponsiveGridDashboard } from 'containers/ResponsiveGridDashboard/ResponsiveGridDashboard'
import { CompactDepartureTile } from './CompactDepartureTile/CompactDepartureTile'

function CompactDashboard() {
    return <ResponsiveGridDashboard TileComponent={CompactDepartureTile} />
}

export { CompactDashboard }
