import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'
import { DocumentSnapshot, onSnapshot } from 'firebase/firestore'
import { Loader } from 'components/Loader'
import { useUser } from './UserProvider'
import { getSettingsReference, updateFirebaseSettings } from './firebase'
import { DEFAULT_SETTINGS, Settings } from './settings'

type SettingsSetter = (settings: Partial<Settings>) => void

const SettingsContext = createContext<[Settings, SettingsSetter] | null>(null)

function SettingsProvider() {
    const [settings, setLocalSettings] = useState<Settings | null>(null)
    const navigate = useNavigate()
    const user = useUser()
    const documentId = useMatch<'documentId', string>('/:page/:documentId')
        ?.params.documentId

    useEffect(() => {
        if (!documentId) return

        // Returns cleanup function
        return onSnapshot(
            getSettingsReference(documentId),
            (documentSnapshot: DocumentSnapshot) => {
                if (!documentSnapshot.exists()) {
                    navigate('/')
                    return
                }

                const data = documentSnapshot.data() as Settings

                // Default values are added to fields if missing
                const settingsWithDefaults: Settings = {
                    ...DEFAULT_SETTINGS,
                    ...data,
                }

                // Stores settings locally on initial load
                setLocalSettings(settingsWithDefaults)

                // If a tavle is locked by a user, you are not allowed to write to
                // tavle unless you are logged in as the user who locked tavla, so we need
                // to check if you have edit access.
                const editAccess =
                    user &&
                    (!data.owners?.length || data.owners.includes(user.uid))

                if (!editAccess) return

                if (
                    Object.keys(data).length !==
                    Object.keys(settingsWithDefaults).length
                ) {
                    updateFirebaseSettings(documentId, settingsWithDefaults)
                }
            },
        )
    }, [user, documentId, navigate])

    const setSettings = useCallback(
        (newSettings: Partial<Settings>) => {
            setLocalSettings((s) => ({ ...s, ...newSettings } as Settings))
            if (documentId) {
                updateFirebaseSettings(documentId, newSettings)
            }
        },
        [documentId],
    )

    if (settings === null) {
        return <Loader />
    }

    return (
        <SettingsContext.Provider value={[settings, setSettings]}>
            <Outlet />
        </SettingsContext.Provider>
    )
}

function useSettings(): [Settings, SettingsSetter] {
    const settingsContext = useContext(SettingsContext)

    if (settingsContext === null) {
        throw new Error(
            'SettingsContext is null. This is because useSettings() was used outside of SettingsProvider and a route with documentId.',
        )
    }

    return settingsContext
}

export type { SettingsSetter }
export { useSettings, SettingsProvider }
