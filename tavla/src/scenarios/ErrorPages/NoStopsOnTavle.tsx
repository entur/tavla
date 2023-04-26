import React from 'react'
import sauerLight from 'assets/images/sauer_lag@2x.png'
import { useSettings } from 'settings/SettingsProvider'
import { ErrorWrapper } from './components/ErrorWrapper'

function NoStopsOnTavle(): JSX.Element {
    const [settings] = useSettings()

    return (
        <div>
            <ErrorWrapper
                title="Nå havnet vi på ville veier."
                message="Vi finner ingen stoppesteder å vise på denne tavla. Rediger tavla eller prøv et nytt søk."
                image={sauerLight}
                altText="Illustrasjon av flere sauer som står på en toglinje"
                theme={settings.theme}
            />
        </div>
    )
}

export { NoStopsOnTavle }
