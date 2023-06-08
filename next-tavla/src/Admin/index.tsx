import { TSettings } from 'types/settings'
import { ThemeSettings } from './scenarios/ThemeSettings'
import { TilesSettings } from './scenarios/TilesSettings'
import { useReducer } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { AddTile } from './scenarios/AddTile'
import { SettingsDispatchContext, settingsReducer } from './reducer'
import { setBoardSettings } from 'utils/firebase'
import { TavlaButton } from './components/Button'

function Admin({
    initialSettings,
    documentId,
}: {
    initialSettings: TSettings
    documentId: string
}) {
    const [settings, dispatch] = useReducer(settingsReducer, initialSettings)

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <div className={classes.settings}>
                <ThemeSettings theme={settings.theme} />
                <AddTile />
                <TilesSettings tiles={settings.tiles} />
                <TavlaButton
                    onClick={() => {
                        setBoardSettings(documentId, settings)
                    }}
                >
                    Lagre instillinger
                </TavlaButton>
            </div>
        </SettingsDispatchContext.Provider>
    )
}

// No SSR for Admin to fix hydration issues
// caused by incompatible libraries (dnd-kit, @entur/dropdown)
// https://github.com/clauderic/dnd-kit/issues/801
const NonSSRAdmin = dynamic(() => Promise.resolve(Admin), { ssr: false })

export { NonSSRAdmin as Admin }
