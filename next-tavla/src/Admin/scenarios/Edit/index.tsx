import { TSettings } from 'types/settings'
import { TilesOverview } from '../TilesOverview'
import { useReducer } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { AddTile } from '../AddTile'
import { setBoardSettings } from 'utils/firebase'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from './reducer'
import { ToastProvider } from '@entur/alert'
import { FloatingButton } from '@entur/button'
import { StyledLink } from 'Admin/components/StyledLink'
import { ShareTable } from '../ShareTable'
import { ToggelColumns } from '../ToggleColumns'

function Edit({
    initialSettings,
    documentId,
}: {
    initialSettings: TSettings
    documentId: string
}) {
    const [settings, dispatch] = useReducer(settingsReducer, initialSettings)
    const linkUrl = window.location.host + '/' + documentId
    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <ToastProvider>
                <div className={classes.settings}>
                    <AddTile />
                    <TilesOverview tiles={settings.tiles} />
                    <ShareTable text={linkUrl} />
                    <ToggelColumns tile={settings.tiles[0]} />
                    <div className={classes.floatingButtonWrapper}>
                        <FloatingButton
                            className={classes.saveButton}
                            size="medium"
                            aria-label={'Lagre instillinger'}
                            onClick={() => {
                                setBoardSettings(documentId, settings)
                            }}
                        >
                            Lagre innstillinger
                        </FloatingButton>
                        <StyledLink
                            linkUrl={'/' + documentId}
                            text="Se avgangstavla"
                        />
                    </div>
                </div>
            </ToastProvider>
        </SettingsDispatchContext.Provider>
    )
}

// No SSR for Admin to fix hydration issues
// caused by incompatible libraries (dnd-kit, @entur/dropdown)
// https://github.com/clauderic/dnd-kit/issues/801
const NonSSRAdmin = dynamic(() => Promise.resolve(Edit), { ssr: false })

export { NonSSRAdmin as Edit }
