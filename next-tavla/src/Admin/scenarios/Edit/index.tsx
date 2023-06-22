import { TSettings } from 'types/settings'
import { ThemeSettings } from '../ThemeSettings'
import { TilesSettings } from '../TilesSettings'
import { useReducer } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { AddTile } from '../AddTile'
import { setBoardSettings } from 'utils/firebase'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from './reducer'
import { TavlaButton } from 'Admin/components/Button'
import { CopyableText, ToastProvider } from '@entur/alert'
import Link from 'next/link'

function Edit({
    initialSettings,
    documentId,
}: {
    initialSettings: TSettings
    documentId: string
}) {
    const [settings, dispatch] = useReducer(settingsReducer, initialSettings)
    const linkURL = window.location.host + '/' + documentId

    console.log(documentId, linkURL)

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <ToastProvider>
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

                    <CopyableText
                        successMessage=""
                        successHeading="Link kopiert!"
                        className={classes.copyText}
                    >
                        {linkURL}
                    </CopyableText>

                    <Link
                        className={classes.linkToBoard}
                        href={'/' + documentId}
                        target="_blank"
                    >
                        Se avgangstavla
                    </Link>
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
