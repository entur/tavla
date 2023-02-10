import * as React from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { DashboardTypes } from 'src/types'
import { TimelineDashboard } from './Timeline/TimelineDashboard'
import { ChronoDashboard } from './Chrono/ChronoDashboard'
import { MapDashboard } from './Map/MapDashboard'
import { BusStopDashboard } from './BusStop/BusStopDashboard'
import { CompactDashboard } from './Compact/CompactDashboard'
import { Poster } from './Poster/Poster'
import { AdminTimeline } from './AdminTimeline'
import { AdminChrono } from './AdminChrono'
import { AdminMap } from './AdminMap'
import { AdminBusStop } from './AdminBusStop'
import { AdminCompact } from './AdminCompact'

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
    }
}

function AdminDashboardResolver() {
    const [settings] = useSettings()

    switch (settings.dashboard) {
        case DashboardTypes.Timeline:
            return <AdminTimeline />
        case DashboardTypes.Chrono:
            return <AdminChrono />
        case DashboardTypes.Map:
            return <AdminMap />
        case DashboardTypes.BusStop:
            return <AdminBusStop />
        case DashboardTypes.Compact:
            return <AdminCompact />
    }
}

export { DashboardResolver, AdminDashboardResolver }
