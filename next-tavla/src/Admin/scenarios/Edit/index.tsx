import { TSettings } from 'types/settings'
import { ThemeSettings } from '../ThemeSettings'
import { TilesSettings } from '../TilesSettings'
import { useReducer, useState } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { AddTile } from '../AddTile'
import { setBoardSettings } from 'utils/firebase'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from './reducer'
import { PrimaryButton } from '@entur/button'
import { useRouter } from 'next/router'
import { CopyText } from 'Admin/components/Copy'
import { TavlaButton } from 'Admin/components/Button'

function Edit({
    initialSettings,
    documentId,
}: {
    initialSettings: TSettings
    documentId: string
}) {
    const [settings, dispatch] = useReducer(settingsReducer, initialSettings)
    const [showLink, setShowLink] = useState(false)
    const router = useRouter()

    function handleClick() {
        router.push('/' + documentId)
    }

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <div className={classes.settings}>
                <ThemeSettings theme={settings.theme} />
                <AddTile />
                <TilesSettings tiles={settings.tiles} />
                <TavlaButton
                    onClick={() => {
                        setBoardSettings(documentId, settings)
                        setShowLink(!showLink)
                    }}
                >
                    Lagre instillinger
                </TavlaButton>
                {showLink && (
                    <div>
                        <CopyText documentId={documentId} />
                        <PrimaryButton
                            onClick={() => {
                                handleClick()
                            }}
                        >
                            Se avgangstavla
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </SettingsDispatchContext.Provider>
    )
}

// No SSR for Admin to fix hydration issues
// caused by incompatible libraries (dnd-kit, @entur/dropdown)
// https://github.com/clauderic/dnd-kit/issues/801
const NonSSRAdmin = dynamic(() => Promise.resolve(Edit), { ssr: false })

export { NonSSRAdmin as Edit }
