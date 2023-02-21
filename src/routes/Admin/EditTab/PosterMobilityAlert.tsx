import React from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { DashboardTypes } from 'src/types'
import { ToastAlertBox } from '@entur/alert'

function PosterMobilityAlert(): JSX.Element {
    const [settings] = useSettings()

    if (
        settings.hiddenModes.length === 0 &&
        settings.dashboard === DashboardTypes.Poster
    ) {
        return (
            <ToastAlertBox variant="info" title="Nå har du valgt for mange!">
                Du kan kun velge tre mobilitetstyper for denne visningstypen.
            </ToastAlertBox>
        )
    }
    return <></>
}

export { PosterMobilityAlert }
