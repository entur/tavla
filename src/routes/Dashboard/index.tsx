import * as React from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { TimelineDashboard } from './Timeline/TimelineDashboard'
import { ChronoDashboard } from './Chrono/ChronoDashboard'
import { MapDashboard } from './Map/MapDashboard'
import { BusStopDashboard } from './BusStop/BusStopDashboard'
import { CompactDashboard } from './Compact/CompactDashboard'
import { Poster } from './Poster/Poster'
import { ResponsiveDashboard } from './Responsive/ResponsiveDashboard'

function DashboardResolver() {
    const [settings] = useSettings()

    switch (settings.dashboard) {
        case 'Timeline':
            return <TimelineDashboard />
        case 'Chrono':
            return <ChronoDashboard />
        case 'Map':
            return <MapDashboard />
        case 'BusStop':
            return <BusStopDashboard />
        // @ts-ignore '' was the old default value. Have the check here instead of allowing new tavles with '' after change to enum
        case '':
        case 'Compact':
            return <CompactDashboard />
        case 'Poster':
            return <Poster />
        case 'Responsive':
            return <ResponsiveDashboard />
    }
}

export { DashboardResolver }
