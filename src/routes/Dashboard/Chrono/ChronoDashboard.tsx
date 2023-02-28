import React from 'react'
import { ResponsiveGridDashboard } from 'containers/ResponsiveGridDashboard/ResponsiveGridDashboard'
import { ChronoDepartureTile } from './ChronoDepartureTile/ChronoDepartureTile'

function ChronoDashboard() {
    return <ResponsiveGridDashboard TileComponent={ChronoDepartureTile} />
}

export { ChronoDashboard }
