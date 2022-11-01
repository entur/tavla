import React from 'react'
import { ToastAlertBox } from '@entur/alert'
import { useSettings } from '../../../settings/SettingsProvider'
import { DashboardTypes } from '../../../types'

function PosterMobilityAlert(): JSX.Element {
    const [settings] = useSettings()

    const isEmptyHiddenMode =
        settings?.hiddenModes?.length !== undefined
            ? settings.hiddenModes.length === 0
            : false
    if (isEmptyHiddenMode && settings?.dashboard === DashboardTypes.Poster) {
        return (
            <ToastAlertBox variant="info" title="Nå har du valgt for mange!">
                Du kan kun velge tre mobilitetstyper for denne visningstypen.
            </ToastAlertBox>
        )
    }
    return <></>
}

export { PosterMobilityAlert }
