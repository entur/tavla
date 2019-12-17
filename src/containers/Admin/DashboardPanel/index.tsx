import React from 'react'
import { RadioGroup, RadioPanel } from '@entur/component-library'

import { useSettingsContext } from '../../../settings'

import './styles.scss'

function DashboardPanel(): JSX.Element {
    const [settings, { setDashboard }] = useSettingsContext()

    const { dashboard = '' } = settings

    const onChange = (event): void => {
        setDashboard(event.target.value)
    }

    return (
        <div className="dashboard-panel">
            <div className="dashboard-panel__header">
                <h2>Dashboard</h2>
            </div>
            <div className="dashboard-panel__row">
                <RadioGroup
                    id="radio-group"
                    name="GroupName"
                    value={dashboard}
                    onChange={onChange}
                >
                    <RadioPanel variant="midnight" label="Entur" value="" />
                    <RadioPanel variant="midnight" label="Kronologisk" value="Chrono" />
                    <RadioPanel variant="midnight" label="Race" value="Race" />
                </RadioGroup>
            </div>
        </div>
    )
}

export default DashboardPanel
