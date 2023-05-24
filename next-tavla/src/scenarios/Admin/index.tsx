import { TSettings } from 'types/settings'
import { ThemeSettings } from './components/ThemeSettings'
import { TilesSettings } from './components/TilesSettings'
import { useReducer } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { AddTile } from './components/AddTile'
import { SettingsDispatchContext, settingsReducer } from './reducer'
import { setBoardSettings } from 'utils/firebase'

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
                <TilesSettings tiles={settings.tiles} />
                <AddTile />
                <button
                    className="button"
                    onClick={() => {
                        setBoardSettings(documentId, settings)
                    }}
                >
                    Lagre instillinger
                </button>
            </div>
        </SettingsDispatchContext.Provider>
    )
}

// No SSR for Admin to fix hydration issues
// caused by incompatible libraries (dnd-kit, @entur/dropdown)
// https://github.com/clauderic/dnd-kit/issues/801
const NonSSRAdmin = dynamic(() => Promise.resolve(Admin), { ssr: false })

export { NonSSRAdmin as Admin }
