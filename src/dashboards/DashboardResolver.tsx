import * as React from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { DashboardTypes } from 'src/types'
import { TimelineDashboard } from './Timeline/TimelineDashboard'
import { ChronoDashboard } from './Chrono/ChronoDashboard'
import { MapDashboard } from './Map/MapDashboard'
import { BusStopDashboard } from './BusStop/BusStopDashboard'
import { CompactDashboard } from './Compact/CompactDashboard'
import { Poster } from './Poster/Poster'
import { ResponsiveDashboard } from './Responsive/ResponsiveDashboard'
import { NewBusStop } from './NewBusStop/NewBusStop'

const DashboardResolver: React.FC = () => {
    const [settings] = useSettings()

    switch (settings.dashboard) {
        case DashboardTypes.Timeline:
            return <TimelineDashboard />
        case DashboardTypes.Chrono:
            return <ChronoDashboard />
        case DashboardTypes.Map:
            return <MapDashboard />
        case DashboardTypes.BusStop:
            return <BusStopDashboard />
        // @ts-ignore '' was the old default value. Have the check here instead of allowing new tavles with '' after change to enum
        case '':
        case DashboardTypes.Compact:
            return <CompactDashboard />
        case DashboardTypes.Poster:
            return <Poster />
        case DashboardTypes.Responsive:
            return <ResponsiveDashboard />
        case DashboardTypes.NewBusStop:
            return <NewBusStop />
    }
}

export { DashboardResolver }
