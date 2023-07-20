import { TSettings } from 'types/settings'
import { TilesOverview } from '../TilesOverview'
import { useReducer } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { AddTile } from '../AddTile'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from './reducer'
import { FloatingButton } from '@entur/button'
import { StyledLink } from 'Admin/components/StyledLink'
import { ShareTable } from '../ShareTable'
import { useAutoSaveSettings } from './hooks/useAutoSaveSettings'

function Edit({
    initialSettings,
    documentId,
}: {
    initialSettings: TSettings
    documentId: string
}) {
    const [settings, dispatch] = useReducer(settingsReducer, initialSettings)

    const linkUrl = window.location.host + '/' + documentId

    const saveSettings = useAutoSaveSettings(documentId, settings)

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <div className={classes.settings}>
                <AddTile />
                <TilesOverview tiles={settings.tiles} />
                <ShareTable text={linkUrl} />
                <div className={classes.floatingButtonWrapper}>
                    <FloatingButton
                        className={classes.saveButton}
                        size="medium"
                        aria-label="Lagre instillinger"
                        onClick={saveSettings}
                    >
                        Lagre innstillinger
                    </FloatingButton>
                    <StyledLink
                        linkUrl={'/' + documentId}
                        text="Se avgangstavla"
                    />
                </div>
            </div>
        </SettingsDispatchContext.Provider>
    )
}

// No SSR for Admin to fix hydration issues
// caused by incompatible libraries (dnd-kit, @entur/dropdown)
// https://github.com/clauderic/dnd-kit/issues/801
const NonSSRAdmin = dynamic(() => Promise.resolve(Edit), { ssr: false })

export { NonSSRAdmin as Edit }
