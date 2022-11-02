import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { useLocation, useMatch } from 'react-router-dom'
import { DocumentSnapshot, onSnapshot } from 'firebase/firestore'
import { Loader } from '@entur/loader'
import { useUser } from '../UserProvider'
import { getSettingsReference } from './firebase'
import { DEFAULT_SETTINGS, Settings } from './settings'
import {
    FieldTypes,
    persistMultipleFields,
    persistSingleField,
} from './FirestoreStorage'

type SettingsSetter = (settings: Partial<Settings>) => void

const SettingsContext = createContext<[Settings, SettingsSetter]>([
    DEFAULT_SETTINGS,
    (): void => undefined,
])

const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [settings, setLocalSettings] = useState<Settings | null>(null)

    const location = useLocation()
    const user = useUser()

    const documentId = useMatch<'documentId', string>('/:page/:documentId')
        ?.params.documentId

    useEffect(() => {
        const protectedPath =
            location.pathname == '/' ||
            location.pathname.split('/')[1] == 'privacy' ||
            location.pathname.split('/')[1] == 'tavler'

        if (protectedPath) {
            setLocalSettings(null)
            return
        }

        if (documentId) {
            return onSnapshot(
                getSettingsReference(documentId),
                (documentSnapshot: DocumentSnapshot) => {
                    if (!documentSnapshot.exists()) {
                        window.location.pathname = '/'
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

                    setLocalSettings((prevSettings) => {
                        const onAdmin =
                            location.pathname.split('/')[1] === 'admin'
                        return prevSettings && onAdmin
                            ? prevSettings
                            : settingsWithDefaults
                    })
                },
            )
        }
    }, [location, user, documentId])

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

    if (!!documentId && settings === null) {
        return <Loader />
    }

    return (
        <SettingsContext.Provider value={[settings!, setSettings]}>
            {children}
        </SettingsContext.Provider>
    )
}

function useSettings(): [Settings, SettingsSetter] {
    const documentId = useMatch<'documentId', string>('/:page/:documentId')
        ?.params.documentId
    if (process.env.NODE_ENV === 'development' && !documentId) {
        // eslint-disable-next-line no-console
        console.warn(
            'Using useSettings outside of a route with documentId will give you DEFAULT_SETTINGS',
        )
    }
    return useContext(SettingsContext)
}

export type { SettingsSetter }
export { useSettings, SettingsProvider }
