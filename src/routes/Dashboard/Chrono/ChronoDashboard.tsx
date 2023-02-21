import React from 'react'
import { ResponsiveGridDashboard } from 'containers/ResponsiveGridDashboard/ResponsiveGridDashboard'
import { ChronoDepartureTile } from './ChronoDepartureTile/ChronoDepartureTile'

const ChronoDashboard = () => (
    <ResponsiveGridDashboard TileComponent={ChronoDepartureTile} />
)

export { ChronoDashboard }
