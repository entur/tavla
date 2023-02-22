import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'
import { DocumentSnapshot, onSnapshot } from 'firebase/firestore'
import { Loader } from 'components/Loader/Loader'
import { useUser } from './UserProvider'
import { getSettingsReference } from './firebase'
import { DEFAULT_SETTINGS, Settings } from './settings'
import {
    FieldTypes,
    persistMultipleFields,
    persistSingleField,
} from './FirestoreStorage'

type SettingsSetter = (settings: Partial<Settings>) => void

const SettingsContext = createContext<[Settings, SettingsSetter] | null>(null)

const SettingsProvider: React.FC = () => {
    const [settings, setLocalSettings] = useState<Settings | null>(null)
    const navigate = useNavigate()
    const user = useUser()
    const onAdmin = useMatch('/admin/*')
    const documentId = useMatch<'documentId', string>('/:page/:documentId')
        ?.params.documentId

    useEffect(() => {
        if (documentId) {
            return onSnapshot(
                getSettingsReference(documentId),
                (documentSnapshot: DocumentSnapshot) => {
                    if (!documentSnapshot.exists()) {
                        navigate('/')
                        return
                    }

                    const data = documentSnapshot.data() as Settings

                    const settingsWithDefaults: Settings = {
                        ...DEFAULT_SETTINGS,
                        ...data,
                    }

                    // The fields under are added if missing, and if the tavle is not locked.
                    // If a tavle is locked by a user, you are not allowed to write to
                    // tavle unless you are logged in as the user who locked tavla, so we need
                    // to check if you have edit access.
                    const editAccess =
                        user &&
                        (!data.owners?.length || data.owners.includes(user.uid))

                    if (editAccess) {
                        Object.entries(DEFAULT_SETTINGS).forEach(
                            ([key, value]) => {
                                if (data[key as keyof Settings] === undefined) {
                                    persistSingleField(
                                        documentId,
                                        key,
                                        value as FieldTypes,
                                    )
                                }
                            },
                        )
                    }

                    setLocalSettings((prevSettings) =>
                        prevSettings && !!onAdmin
                            ? prevSettings
                            : settingsWithDefaults,
                    )
                },
            )
        }
    }, [onAdmin, user, documentId, navigate])

    const setSettings = useCallback(
        (newSettings: Partial<Settings>) => {
            const mergedSettings = { ...settings, ...newSettings } as Settings
            setLocalSettings(mergedSettings)
            if (documentId) {
                persistMultipleFields(documentId, mergedSettings)
            }
        },
        [settings, documentId],
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
