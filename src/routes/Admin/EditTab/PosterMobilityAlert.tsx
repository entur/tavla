import React from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { ToastAlertBox } from '@entur/alert'

function PosterMobilityAlert(): JSX.Element {
    const [settings] = useSettings()

    if (settings.hiddenModes.length === 0 && settings.dashboard === 'Poster') {
        return (
            <ToastAlertBox variant="info" title="Nå har du valgt for mange!">
                Du kan kun velge tre mobilitetstyper for denne visningstypen.
            </ToastAlertBox>
        )
    }
    return <></>
}

export { PosterMobilityAlert }
