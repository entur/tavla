import { TSettings } from 'types/settings'
import { TilesOverview } from '../TilesOverview'
import { useReducer, useState } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { AddTile } from '../AddTile'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from './reducer'
import {
    PrimaryButton,
    SecondaryButton,
    SecondarySquareButton,
} from '@entur/button'
import { useAutoSaveSettings } from './hooks/useAutoSaveSettings'
import { Heading1 } from '@entur/typography'
import {
    CheckIcon,
    CloseIcon,
    CopyIcon,
    EditIcon,
    SaveIcon,
} from '@entur/icons'
import { SecondaryLink } from 'components/SecondaryLink'
import { useToast } from '@entur/alert'
import { Login } from '../Login'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

const LOGIN_ENABLED = false
import { TextField } from '@entur/form'

function Edit({
    initialSettings,
    documentId,
    user,
}: {
    initialSettings: TSettings
    documentId: string
    user: DecodedIdToken | null
}) {
    const [settings, dispatch] = useReducer(settingsReducer, initialSettings)
    const { addToast } = useToast()

    const [editingTitle, setEditingTitle] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(initialSettings.title || 'Tavla')

    const linkUrl = window.location.host + '/' + documentId

    const saveSettings = useAutoSaveSettings(documentId, settings)

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <div className={classes.settings}>
                <div className="flexBetween">
                    <div className={classes.leftContainer}>
                        {editingTitle ? (
                            <>
                                <TextField
                                    defaultValue={title}
                                    size="medium"
                                    label="Tavlenavn"
                                    className={classes.editInput}
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                                <SecondarySquareButton
                                    className={classes.squareButton}
                                    onClick={() => {
                                        settings.title = title
                                        setEditingTitle(false)
                                    }}
                                >
                                    <CheckIcon aria-label="Bekreft tittelendring" />
                                </SecondarySquareButton>
                                <SecondarySquareButton
                                    className={classes.squareButton}
                                    onClick={() => {
                                        setTitle(settings.title || 'Tavla')
                                        setEditingTitle(false)
                                    }}
                                >
                                    <CloseIcon aria-label="Avbryt tittelendring" />
                                </SecondarySquareButton>
                            </>
                        ) : (
                            <>
                                <Heading1
                                    className={classes.title}
                                    onClick={() => setEditingTitle(true)}
                                >
                                    {settings.title || 'Tavla'}
                                </Heading1>
                                <SecondarySquareButton
                                    className={classes.squareButton}
                                    onClick={() => setEditingTitle(true)}
                                >
                                    <EditIcon aria-label="Rediger tittel" />
                                </SecondarySquareButton>
                            </>
                        )}
                    </div>
                    <div className="flexGap">
                        <SecondaryButton
                            onClick={() => {
                                navigator.clipboard.writeText(linkUrl)
                                addToast('Lenke til Tavla kopiert')
                            }}
                        >
                            Kopier lenke til Tavla
                            <CopyIcon />
                        </SecondaryButton>
                        <SecondaryLink
                            external
                            href={'/' + documentId}
                            text="Se Tavla"
                        />
                        <PrimaryButton onClick={saveSettings}>
                            Lagre tavla
                            <SaveIcon />
                        </PrimaryButton>

                        {LOGIN_ENABLED && <Login user={user} />}
                    </div>
                </div>
                <AddTile />
                <TilesOverview tiles={settings.tiles} />
            </div>
        </SettingsDispatchContext.Provider>
    )
}

// No SSR for Admin to fix hydration issues
// caused by incompatible libraries (dnd-kit, @entur/dropdown)
// https://github.com/clauderic/dnd-kit/issues/801
const NonSSRAdmin = dynamic(() => Promise.resolve(Edit), { ssr: false })

export { NonSSRAdmin as Edit }
